import { b } from "./baml_client"
import * as tools from "./tools"
import type { AgentResponse } from "./baml_client/types"
import * as ui from "./ui"

/**
 * Shopping Agent - AI-powered e-commerce assistant
 * Handles user requests through multi-turn conversations with tool execution
 */
export class ShoppingAgent {
  private conversationHistory: string[] = []
  private maxIterations = 10
  private currentProductContext: { productId: string; title: string } | null = null
  private maxHistoryLength = 20 // Keep last N conversation entries

  /**
   * Process a user request and return a formatted response
   */
  async run(userRequest: string): Promise<string> {
    // Handle special commands
    const lowerRequest = userRequest.toLowerCase().trim()
    
    if (lowerRequest === 'help' || lowerRequest === '?') {
      return ui.helpMenu()
    }
    
    if (lowerRequest === 'cart' || lowerRequest === 'view cart' || lowerRequest === 'show cart') {
      return this.formatCartResponse(await tools.viewCart())
    }
    
    if (lowerRequest === 'wishlist' || lowerRequest === 'show wishlist' || lowerRequest === 'view wishlist') {
      return this.formatWishlistResponse(await tools.viewWishlist())
    }
    
    if (lowerRequest === 'orders' || lowerRequest === 'my orders' || lowerRequest === 'order history') {
      return this.formatOrdersResponse(await tools.viewOrders())
    }
    
    if (lowerRequest === 'clear cart' || lowerRequest === 'empty cart') {
      const result = await tools.clearCart()
      return ui.messageBox(result.message, 'success')
    }
    
    if (lowerRequest === 'clear history' || lowerRequest === 'reset') {
      this.conversationHistory = []
      this.currentProductContext = null
      return ui.messageBox('Conversation history cleared. Starting fresh!', 'success')
    }

    // Build context-aware request
    let enrichedRequest = userRequest
    
    // If user references "this", "it", "the product", etc. and we have context, enrich the request
    const contextualPhrases = ['this', 'it', 'that', 'the product', 'this product', 'this item', 'buy now', 'add to cart', 'purchase']
    const needsContext = contextualPhrases.some(phrase => lowerRequest.includes(phrase))
    
    if (needsContext && this.currentProductContext) {
      enrichedRequest = `${userRequest} [Context: User is referring to ${this.currentProductContext.title} (ID: ${this.currentProductContext.productId})]`
    }

    // Add to conversation history (don't reset - maintain context across requests)
    this.conversationHistory.push(`User: ${enrichedRequest}`)
    
    // Trim history if too long (keep recent context)
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength)
    }

    let iteration = 0
    let lastToolResults: string[] = []

    while (iteration < this.maxIterations) {
      iteration++

      const history = this.conversationHistory.join("\n\n")
      
      let response: AgentResponse
      try {
        response = await b.DecideNextAction(userRequest, history)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        return ui.messageBox(`Failed to process request: ${errorMsg}`, 'error')
      }

      this.conversationHistory.push(`Agent Thought: ${response.thought}`)

      // If no tool needed or should stop, return final response
      if (!response.should_continue || response.action.tool === "None") {
        const finalResponse = response.final_response || response.thought
        return this.formatFinalResponse(finalResponse, lastToolResults)
      }

      // Execute the tool
      try {
      const toolResult = await this.executeTool(
        response.action.tool,
        response.action.parameters
      )

        const formattedResult = this.formatToolResult(response.action.tool, toolResult)
        lastToolResults.push(formattedResult)

      this.conversationHistory.push(
        `Tool: ${response.action.tool}\nParameters: ${response.action.parameters}\nResult: ${JSON.stringify(toolResult, null, 2)}`
      )

        // If there's a final response after tool execution, return it
      if (response.final_response) {
          return this.formatFinalResponse(response.final_response, lastToolResults)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        return ui.messageBox(`Tool execution failed: ${errorMsg}`, 'error')
      }
    }

    return ui.messageBox(
      "I've processed your request but need more information. Could you please clarify?",
      'warning'
    )
  }

  /**
   * Execute a tool based on name and parameters
   */
  private async executeTool(tool: string, parametersJson: string): Promise<unknown> {
    let params: Record<string, unknown>
    
    try {
      params = JSON.parse(parametersJson)
    } catch {
      throw new Error(`Invalid parameters format: ${parametersJson}`)
    }

      switch (tool) {
        case "SearchProducts": {
          const results = await tools.searchProducts(
            params.searchTerm as string,
            params.filters as tools.FilterOptions | undefined
          )
          // If only one result, set it as current context
          if (results.length === 1) {
            this.currentProductContext = {
              productId: results[0].id,
              title: results[0].title
            }
          }
          return results
        }

        case "GetProductDetails": {
          const product = await tools.getProductDetails(params.productId as string)
          // Track the current product context for follow-up requests
          this.currentProductContext = {
            productId: product.id,
            title: product.title
          }
          return product
        }

        case "GetProductReviews":
        return await tools.getProductReviews(params.productId as string)

        case "PurchaseProduct":
        return await tools.purchaseProduct(
          params.productId as string,
          (params.quantity as number) || 1
        )

      case "AddToCart":
        return await tools.addToCart(
          params.productId as string,
          (params.quantity as number) || 1
        )

      case "RemoveFromCart":
        return await tools.removeFromCart(params.productId as string)

      case "ViewCart":
        return await tools.viewCart()

      case "AddToWishlist":
        return await tools.addToWishlist(params.productId as string)

      case "RemoveFromWishlist":
        return await tools.removeFromWishlist(params.productId as string)

      case "ViewWishlist":
        return await tools.viewWishlist()

      case "CompareProducts":
        return await tools.compareProducts(params.productIds as string[])

      case "Checkout":
        return await tools.checkout()

      case "ViewOrders":
        return await tools.viewOrders()

      case "GetRecommendations":
        return await tools.getRecommendations(
          params.productId as string,
          (params.limit as number) || 3
        )

        default:
          throw new Error(`Unknown tool: ${tool}`)
      }
  }

  /**
   * Format tool results for display
   */
  private formatToolResult(toolName: string, result: unknown): string {
    switch (toolName) {
      case "SearchProducts": {
        const products = result as tools.SearchResult[]
        if (products.length === 0) {
          return ui.messageBox('No products found matching your search.', 'info')
        }
        
        let output = `\n${ui.divider(`${ui.icons.search} Found ${products.length} products`)}\n\n`
        for (const product of products) {
          output += ui.productCard(product) + '\n'
        }
        return output
      }

      case "GetProductDetails": {
        const product = result as tools.ProductDetails
        let output = `\n${ui.divider(`${ui.icons.package} Product Details`)}\n\n`
        output += ui.productCard(product) + '\n'
        output += `\n  ${ui.style.bold('Description:')}\n`
        output += `  ${ui.wrapText(product.description, 60).split('\n').join('\n  ')}\n`
        return output
      }

      case "GetProductReviews": {
        const reviews = result as tools.ProductReview[]
        let output = `\n${ui.divider(`${ui.icons.star} Customer Reviews`)}\n\n`
        for (const review of reviews) {
          output += ui.formatReview(review) + '\n\n'
        }
        return output
      }

      case "AddToCart": {
        const cartResult = result as { success: boolean; message: string; cart: { items: tools.SearchResult[]; total: number } }
        return ui.messageBox(`${ui.icons.cart} ${cartResult.message}`, 'success')
      }

      case "RemoveFromCart": {
        const cartResult = result as { success: boolean; message: string }
        return ui.messageBox(cartResult.message, 'success')
      }

      case "ViewCart": {
        return this.formatCartResponse(result as { items: Array<{ title: string; price: number; quantity: number }>; total: number })
      }

      case "AddToWishlist":
      case "RemoveFromWishlist": {
        const wishResult = result as { success: boolean; message: string }
        return ui.messageBox(`${ui.icons.heart} ${wishResult.message}`, 'success')
      }

      case "ViewWishlist": {
        return this.formatWishlistResponse(result as tools.ProductDetails[])
      }

      case "CompareProducts": {
        const products = result as tools.ProductDetails[]
        return ui.comparisonTable(products.map(p => ({
          title: p.title,
          price: p.price,
          rating: p.rating,
          features: [p.description.substring(0, 100)],
        })))
      }

      case "PurchaseProduct":
      case "Checkout": {
        const order = result as { orderId: string; items: Array<{ title: string; price: number; quantity: number }>; total: number; estimatedDelivery?: string }
        return ui.orderConfirmation(order)
      }

      case "ViewOrders": {
        return this.formatOrdersResponse(result as Array<{ orderId: string; items: Array<{ title: string; price: number; quantity: number }>; total: number; status: string; orderDate: string }>)
      }

      case "GetRecommendations": {
        const products = result as tools.SearchResult[]
        let output = `\n${ui.divider(`${ui.icons.sparkle} Recommended for You`)}\n\n`
        for (const product of products) {
          output += ui.productCard(product) + '\n'
        }
        return output
      }

      default:
        return JSON.stringify(result, null, 2)
    }
  }

  /**
   * Format the final response to the user
   */
  private formatFinalResponse(message: string, toolResults: string[]): string {
    let output = ''
    
    // Include any tool results
    if (toolResults.length > 0) {
      output += toolResults.join('\n')
    }
    
    // Add the agent's message with proper markdown formatting
    if (message) {
      const formattedMessage = ui.formatMarkdown(message)
      output += `\n${formattedMessage}\n`
    }
    
    return output
  }

  /**
   * Format cart response
   */
  private formatCartResponse(cart: { items: Array<{ title: string; price: number; quantity: number; productId?: string }>; total: number }): string {
    return ui.cartSummary(cart.items, cart.total)
  }

  /**
   * Format wishlist response
   */
  private formatWishlistResponse(products: tools.ProductDetails[]): string {
    if (products.length === 0) {
      return ui.messageBox(`${ui.icons.heart} Your wishlist is empty. Save items you like for later!`, 'info')
    }
    
    let output = `\n${ui.divider(`${ui.icons.heart} Your Wishlist (${products.length} items)`)}\n\n`
    for (const product of products) {
      output += ui.productCard({ ...product, inWishlist: true }) + '\n'
    }
    return output
  }

  /**
   * Format orders response
   */
  private formatOrdersResponse(orders: Array<{ orderId: string; items: Array<{ title: string; price: number; quantity: number }>; total: number; status: string; orderDate: string }>): string {
    if (orders.length === 0) {
      return ui.messageBox(`${ui.icons.package} No orders yet. Start shopping!`, 'info')
    }
    
    let output = `\n${ui.divider(`${ui.icons.package} Order History`)}\n\n`
    
    for (const order of orders) {
      const statusIcon = order.status === 'delivered' ? ui.icons.success : 
                        order.status === 'shipped' ? ui.icons.truck : ui.icons.clock
      
      output += `  ${ui.style.bold(`Order ${ui.style.accent(order.orderId)}`)}\n`
      output += `  ${statusIcon} ${ui.style.muted(order.status.toUpperCase())} • ${ui.formatDate(order.orderDate)}\n`
      
      for (const item of order.items) {
        output += `    ${ui.icons.bullet} ${item.title.substring(0, 40)}${item.title.length > 40 ? '...' : ''}\n`
      }
      
      output += `  ${ui.style.bold('Total:')} ${ui.style.price(ui.formatPrice(order.total))}\n\n`
    }
    
    return output
  }
}
