import { mockData, cart, wishlist, orders, CartItem, Order } from "./data"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type SearchResult = {
  id: string
  title: string
  price: number
  rating: number
  numRatings: number
  deliveryDate: string
  inCart?: boolean
  inWishlist?: boolean
}

export type ProductDetails = {
  id: string
  title: string
  price: number
  rating: number
  numRatings: number
  description: string
  images: string[]
  deliveryDate: string
  inCart?: boolean
  inWishlist?: boolean
}

export type ProductReview = {
  rating: number
  comment: string
  date: string
}

export type FilterOptions = {
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity'
}

// ============================================================================
// SEARCH KEYWORD ALIASES - Maps common search terms to product-related keywords
// ============================================================================

const SEARCH_ALIASES: Record<string, string[]> = {
  // Audio category - focused on audio product keywords (use specific brand/product terms)
  audio: ['headphones', 'earbuds', 'speaker', 'echo dot', 'noise cancelling', 'airpods', 'bose', 'sony wh-', 'quietcomfort', 'spatial audio', 'xm5'],
  music: ['headphones', 'earbuds', 'speaker'],
  headphones: ['earbuds', 'noise cancelling', 'over-ear', 'wh-1000', 'quietcomfort', 'airpods pro'],
  earbuds: ['airpods', 'in-ear'],
  speakers: ['speaker', 'echo', 'alexa', 'smart speaker', 'echo dot'],
  sound: ['headphones', 'earbuds', 'speaker'],
  
  // Tech/Accessories category
  tech: ['usb', 'cable', 'mouse', 'keyboard', 'speaker', 'headphones', 'echo'],
  electronics: ['usb', 'cable', 'mouse', 'keyboard', 'speaker', 'headphones', 'echo'],
  accessories: ['cable', 'mouse', 'keyboard', 'usb'],
  cables: ['usb', 'cable', 'usb-c', 'usb c'],
  charger: ['usb', 'cable', 'charging', 'fast charging', 'power delivery'],
  charging: ['usb', 'cable', 'charger', 'power delivery'],
  
  // Outdoor category
  outdoor: ['hiking', 'boots', 'trekking', 'mountaineering', 'trail'],
  hiking: ['boots', 'trekking', 'trail', 'outdoor', 'waterproof', 'gtx'],
  boots: ['hiking', 'trekking', 'mountaineering', 'waterproof'],
  shoes: ['boots', 'hiking', 'trekking'],
  trekking: ['hiking', 'boots', 'mountaineering'],
  
  // Smart home
  'smart home': ['alexa', 'echo', 'smart speaker'],
  smart: ['alexa', 'echo', 'smart speaker'],
  alexa: ['echo', 'smart speaker', 'echo dot'],
}

// ============================================================================
// PRODUCT SEARCH & DISCOVERY
// ============================================================================

/**
 * Search for products with optional filters
 * Searches in both title and description, with keyword alias expansion
 */
export async function searchProducts(
  searchTerm: string,
  filters?: FilterOptions
): Promise<SearchResult[]> {
  const searchLower = searchTerm.toLowerCase()
  
  // Expand search term with aliases for title matching only
  const expandedTermsForTitle = [searchLower]
  for (const [key, aliases] of Object.entries(SEARCH_ALIASES)) {
    if (searchLower.includes(key)) {
      expandedTermsForTitle.push(...aliases)
    }
  }
  
  // Remove duplicates
  const uniqueTitleTerms = Array.from(new Set(expandedTermsForTitle))
  
  let results = mockData.searchResults.filter((result) => {
    const titleLower = result.title.toLowerCase()
    
    // Check if any expanded term matches the title
    const titleMatch = uniqueTitleTerms.some(term => titleLower.includes(term))
    if (titleMatch) return true
    
    // For description, only use the original search term (not expanded aliases)
    // This prevents false positives from common words in descriptions
    const details = mockData.productDetails[result.id]
    const descriptionLower = details?.description?.toLowerCase() || ''
    return descriptionLower.includes(searchLower)
  })

  // Apply filters
  if (filters) {
    if (filters.minPrice !== undefined) {
      results = results.filter(r => r.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(r => r.price <= filters.maxPrice!)
    }
    if (filters.minRating !== undefined) {
      results = results.filter(r => r.rating >= filters.minRating!)
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          results.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          results.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          results.sort((a, b) => b.rating - a.rating)
          break
        case 'popularity':
          results.sort((a, b) => b.numRatings - a.numRatings)
          break
      }
    }
  }

  // Enrich with cart/wishlist status
  return results.map(r => ({
    ...r,
    inCart: cart.items.some(item => item.productId === r.id),
    inWishlist: wishlist.items.includes(r.id),
  }))
}

/**
 * Get detailed product information
 */
export async function getProductDetails(
  productId: string
): Promise<ProductDetails> {
  const productDetails = mockData.productDetails[productId]
  if (!productDetails) {
    throw new Error(`Product with ID "${productId}" not found`)
  }
  
  return {
    ...productDetails,
    inCart: cart.items.some(item => item.productId === productId),
    inWishlist: wishlist.items.includes(productId),
  }
}

/**
 * Get product reviews
 */
export async function getProductReviews(
  productId: string
): Promise<ProductReview[]> {
  const productReviews = mockData.productReviews[productId]
  if (!productReviews) {
    throw new Error(`No reviews found for product ID "${productId}"`)
  }
  return productReviews
}

/**
 * Compare multiple products side by side
 */
export async function compareProducts(
  productIds: string[]
): Promise<ProductDetails[]> {
  const products: ProductDetails[] = []
  
  for (const id of productIds) {
    const details = mockData.productDetails[id]
    if (details) {
      products.push({
        ...details,
        inCart: cart.items.some(item => item.productId === id),
        inWishlist: wishlist.items.includes(id),
      })
    }
  }
  
  if (products.length === 0) {
    throw new Error('No valid products found to compare')
  }
  
  return products
}

// ============================================================================
// SHOPPING CART OPERATIONS
// ============================================================================

/**
 * Add a product to the shopping cart
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; message: string; cart: typeof cart }> {
  const product = mockData.productDetails[productId]
  if (!product) {
    throw new Error(`Product with ID "${productId}" not found`)
  }

  const existingItem = cart.items.find(item => item.productId === productId)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({
      productId,
      title: product.title,
      price: product.price,
      quantity,
    })
  }

  // Recalculate total
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return {
    success: true,
    message: `Added ${quantity}x "${product.title}" to cart`,
    cart: { ...cart },
  }
}

/**
 * Remove a product from the cart
 */
export async function removeFromCart(
  productId: string
): Promise<{ success: boolean; message: string; cart: typeof cart }> {
  const itemIndex = cart.items.findIndex(item => item.productId === productId)
  
  if (itemIndex === -1) {
    throw new Error(`Product "${productId}" is not in your cart`)
  }

  const removed = cart.items.splice(itemIndex, 1)[0]
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return {
    success: true,
    message: `Removed "${removed.title}" from cart`,
    cart: { ...cart },
  }
}

/**
 * Update quantity of an item in cart
 */
export async function updateCartQuantity(
  productId: string,
  quantity: number
): Promise<{ success: boolean; message: string; cart: typeof cart }> {
  const item = cart.items.find(item => item.productId === productId)
  
  if (!item) {
    throw new Error(`Product "${productId}" is not in your cart`)
  }

  if (quantity <= 0) {
    return removeFromCart(productId)
  }

  item.quantity = quantity
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return {
    success: true,
    message: `Updated quantity to ${quantity}`,
    cart: { ...cart },
  }
}

/**
 * View the current shopping cart
 */
export async function viewCart(): Promise<typeof cart> {
  return { ...cart }
}

/**
 * Clear the entire cart
 */
export async function clearCart(): Promise<{ success: boolean; message: string }> {
  cart.items = []
  cart.total = 0
  
  return {
    success: true,
    message: 'Cart has been cleared',
  }
}

// ============================================================================
// WISHLIST OPERATIONS
// ============================================================================

/**
 * Add a product to the wishlist
 */
export async function addToWishlist(
  productId: string
): Promise<{ success: boolean; message: string; wishlist: string[] }> {
  const product = mockData.productDetails[productId]
  if (!product) {
    throw new Error(`Product with ID "${productId}" not found`)
  }

  if (wishlist.items.includes(productId)) {
    return {
      success: true,
      message: `"${product.title}" is already in your wishlist`,
      wishlist: [...wishlist.items],
    }
  }

  wishlist.items.push(productId)

  return {
    success: true,
    message: `Added "${product.title}" to wishlist`,
    wishlist: [...wishlist.items],
  }
}

/**
 * Remove a product from the wishlist
 */
export async function removeFromWishlist(
  productId: string
): Promise<{ success: boolean; message: string; wishlist: string[] }> {
  const index = wishlist.items.indexOf(productId)
  
  if (index === -1) {
    throw new Error(`Product "${productId}" is not in your wishlist`)
  }

  wishlist.items.splice(index, 1)
  const product = mockData.productDetails[productId]

  return {
    success: true,
    message: `Removed "${product?.title || productId}" from wishlist`,
    wishlist: [...wishlist.items],
  }
}

/**
 * View the wishlist with full product details
 */
export async function viewWishlist(): Promise<ProductDetails[]> {
  const products: ProductDetails[] = []
  
  for (const id of wishlist.items) {
    const details = mockData.productDetails[id]
    if (details) {
      products.push({
        ...details,
        inCart: cart.items.some(item => item.productId === id),
        inWishlist: true,
      })
    }
  }
  
  return products
}

/**
 * Move an item from wishlist to cart
 */
export async function moveWishlistToCart(
  productId: string
): Promise<{ success: boolean; message: string }> {
  if (!wishlist.items.includes(productId)) {
    throw new Error(`Product "${productId}" is not in your wishlist`)
  }

  await removeFromWishlist(productId)
  await addToCart(productId, 1)

  const product = mockData.productDetails[productId]
  return {
    success: true,
    message: `Moved "${product?.title}" from wishlist to cart`,
  }
}

// ============================================================================
// PURCHASE & ORDERS
// ============================================================================

/**
 * Purchase a single product directly
 */
export async function purchaseProduct(
  productId: string,
  quantity: number = 1
): Promise<Order> {
  const product = mockData.productDetails[productId]
  if (!product) {
    throw new Error(`Product with ID "${productId}" not found`)
  }

  const order: Order = {
    orderId: generateOrderId(),
    items: [{
      productId,
      title: product.title,
      price: product.price,
      quantity,
    }],
    total: product.price * quantity,
    status: 'confirmed',
    orderDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: product.deliveryDate,
  }

  orders.push(order)
  return order
}

/**
 * Checkout the current cart
 */
export async function checkout(): Promise<Order> {
  if (cart.items.length === 0) {
    throw new Error('Your cart is empty. Add items before checkout.')
  }

  // Find the latest delivery date among all items
  let latestDelivery = ''
  for (const item of cart.items) {
    const product = mockData.productDetails[item.productId]
    if (product && product.deliveryDate > latestDelivery) {
      latestDelivery = product.deliveryDate
    }
  }

  const order: Order = {
    orderId: generateOrderId(),
    items: [...cart.items],
    total: cart.total,
    status: 'confirmed',
    orderDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: latestDelivery || undefined,
  }

  orders.push(order)

  // Clear the cart after checkout
  cart.items = []
  cart.total = 0

  return order
}

/**
 * View order history
 */
export async function viewOrders(): Promise<Order[]> {
  return [...orders]
}

/**
 * Get details of a specific order
 */
export async function getOrderDetails(orderId: string): Promise<Order> {
  const order = orders.find(o => o.orderId === orderId)
  if (!order) {
    throw new Error(`Order "${orderId}" not found`)
  }
  return order
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a unique order ID
 */
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

/**
 * Get product recommendations based on a product
 */
export async function getRecommendations(
  productId: string,
  limit: number = 3
): Promise<SearchResult[]> {
  const product = mockData.productDetails[productId]
  if (!product) {
    throw new Error(`Product "${productId}" not found`)
  }

  // Simple recommendation: find products in similar price range
  const priceRange = product.price * 0.5
  
  const recommendations = mockData.searchResults
    .filter(p => p.id !== productId)
    .filter(p => Math.abs(p.price - product.price) <= priceRange)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(r => ({
      ...r,
      inCart: cart.items.some(item => item.productId === r.id),
      inWishlist: wishlist.items.includes(r.id),
    }))

  return recommendations
}

/**
 * Get all available products (for browsing)
 */
export async function getAllProducts(): Promise<SearchResult[]> {
  return mockData.searchResults.map(r => ({
    ...r,
    inCart: cart.items.some(item => item.productId === r.id),
    inWishlist: wishlist.items.includes(r.id),
  }))
}
