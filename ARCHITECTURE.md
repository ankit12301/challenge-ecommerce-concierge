# 🛍️ E-Commerce Shopping Concierge - Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Component Deep Dive](#component-deep-dive)
4. [Data Flow](#data-flow)
5. [AI Agent System](#ai-agent-system)
6. [Tool System](#tool-system)
7. [User Interface](#user-interface)
8. [Configuration](#configuration)
9. [Extending the Application](#extending-the-application)

---

## Overview

The E-Commerce Shopping Concierge is an AI-powered command-line shopping assistant that helps users discover products, manage their shopping cart and wishlist, read reviews, compare products, and complete purchases. It uses a conversational AI agent that can reason about user requests and execute appropriate actions.

### Key Features

- 🔍 **Product Search & Discovery** - Natural language search with filters
- 📋 **Product Details & Reviews** - Detailed information and customer feedback
- 🛒 **Shopping Cart** - Add, remove, update quantities
- ❤️ **Wishlist** - Save items for later
- 🔄 **Product Comparison** - Side-by-side comparison
- 💳 **Checkout & Orders** - Complete purchases and view history
- 🎯 **Smart Recommendations** - AI-powered suggestions

### Technology Stack

| Component       | Technology                         |
| --------------- | ---------------------------------- |
| Runtime         | Node.js with TypeScript            |
| AI Framework    | BAML (Boundary AI Markup Language) |
| LLM Provider    | OpenRouter (DeepSeek, Kat Coder)   |
| Package Manager | npm                                |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│                          (index.ts)                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────────┐│
│  │   Welcome   │  │   Command    │  │      Response Display       ││
│  │   Banner    │  │   Input      │  │   (Formatted Output)        ││
│  └─────────────┘  └──────────────┘  └─────────────────────────────┘│
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SHOPPING AGENT                                 │
│                        (agent.ts)                                    │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  • Manages conversation history                                  ││
│  │  • Coordinates AI reasoning with tool execution                  ││
│  │  • Formats responses for display                                 ││
│  │  • Handles special commands (help, cart, wishlist)              ││
│  └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────┬────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────────────────┐
│     BAML AI CLIENT      │    │           TOOL SYSTEM               │
│    (baml_client/)       │    │           (tools.ts)                │
│ ┌─────────────────────┐ │    │ ┌─────────────────────────────────┐ │
│ │ DecideNextAction()  │ │    │ │  Product Tools:                 │ │
│ │                     │ │    │ │  • searchProducts()             │ │
│ │ - Analyzes request  │ │    │ │  • getProductDetails()          │ │
│ │ - Selects tools     │ │    │ │  • getProductReviews()          │ │
│ │ - Returns response  │ │    │ │  • compareProducts()            │ │
│ └─────────────────────┘ │    │ │  • getRecommendations()         │ │
│           │             │    │ ├─────────────────────────────────┤ │
│           ▼             │    │ │  Cart Tools:                    │ │
│ ┌─────────────────────┐ │    │ │  • addToCart()                  │ │
│ │   OpenRouter API    │ │    │ │  • removeFromCart()             │ │
│ │  (DeepSeek/KatCoder)│ │    │ │  • viewCart()                   │ │
│ └─────────────────────┘ │    │ ├─────────────────────────────────┤ │
└─────────────────────────┘    │ │  Wishlist Tools:                │ │
                               │ │  • addToWishlist()              │ │
                               │ │  • removeFromWishlist()         │ │
                               │ │  • viewWishlist()               │ │
                               │ ├─────────────────────────────────┤ │
                               │ │  Order Tools:                   │ │
                               │ │  • purchaseProduct()            │ │
                               │ │  • checkout()                   │ │
                               │ │  • viewOrders()                 │ │
                               │ └─────────────────────────────────┘ │
                               └───────────────┬─────────────────────┘
                                               │
                                               ▼
                               ┌─────────────────────────────────────┐
                               │           DATA LAYER                │
                               │           (data.ts)                 │
                               │ ┌─────────────────────────────────┐ │
                               │ │  Static Data:                   │ │
                               │ │  • Product Catalog              │ │
                               │ │  • Product Details              │ │
                               │ │  • Product Reviews              │ │
                               │ ├─────────────────────────────────┤ │
                               │ │  Session State:                 │ │
                               │ │  • Shopping Cart                │ │
                               │ │  • Wishlist                     │ │
                               │ │  • Order History                │ │
                               │ └─────────────────────────────────┘ │
                               └─────────────────────────────────────┘
```

---

## Component Deep Dive

### 1. Entry Point (`index.ts`)

The main entry point that bootstraps the application.

**Responsibilities:**

- Environment setup and validation
- Creating the readline interface for user input
- Initializing the shopping agent
- Handling application lifecycle (start, shutdown)
- Managing retry logic for failed requests

**Key Class: `ShoppingConcierge`**

```typescript
class ShoppingConcierge {
  private rl: readline.Interface; // User input handler
  private agent: ShoppingAgent; // AI shopping assistant
  private isProcessing: boolean; // Prevents concurrent requests
}
```

**Flow:**

1. Load environment variables from `.env`
2. Validate API key is present
3. Display welcome banner
4. Enter input loop
5. Route input to agent or handle special commands
6. Display formatted response
7. Repeat until exit

---

### 2. Shopping Agent (`agent.ts`)

The brain of the application - coordinates between user requests, AI reasoning, and tool execution.

**Responsibilities:**

- Managing conversation context
- Invoking the AI model for decision-making
- Executing tools based on AI decisions
- Formatting responses for the terminal
- Handling special quick-commands

**Key Class: `ShoppingAgent`**

```typescript
class ShoppingAgent {
  private conversationHistory: string[];      // Tracks the conversation (persists across requests)
  private maxIterations: number;              // Prevents infinite loops
  private currentProductContext: {...} | null; // Tracks last viewed product for contextual actions
  private maxHistoryLength: number;           // Limits history size for performance
}
```

**Context Tracking:**

The agent maintains context between requests to handle follow-up actions like "Buy now" or "Add to cart" after viewing a product:

```typescript
// When user views a product, we track it
case "GetProductDetails": {
  const product = await tools.getProductDetails(productId)
  this.currentProductContext = {
    productId: product.id,
    title: product.title
  }
  return product
}

// On subsequent requests, context is injected
if (needsContext && this.currentProductContext) {
  enrichedRequest = `${userRequest} [Context: User is referring to ${this.currentProductContext.title} (ID: ${this.currentProductContext.productId})]`
}
```

**The Agent Loop:**

```
User Request
     │
     ▼
┌─────────────────┐
│ Add to History  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Call AI: DecideNextAction()     │◄──────────┐
│                                     │           │
│  Input:                             │           │
│  - User request                     │           │
│  - Conversation history             │           │
│                                     │           │
│  Output:                            │           │
│  - thought (reasoning)              │           │
│  - action (tool to call)            │           │
│  - should_continue (bool)           │           │
│  - final_response (if done)         │           │
└────────────────┬────────────────────┘           │
                 │                                │
                 ▼                                │
         ┌──────────────┐                         │
         │ Should       │─── No ──► Return final  │
         │ Continue?    │          response       │
         └──────┬───────┘                         │
                │ Yes                             │
                ▼                                 │
        ┌───────────────┐                         │
        │ Execute Tool  │                         │
        └───────┬───────┘                         │
                │                                 │
                ▼                                 │
        ┌───────────────┐                         │
        │ Add Result    │                         │
        │ to History    │─────────────────────────┘
        └───────────────┘
```

---

### 3. BAML Configuration (`baml_src/`)

BAML (Boundary AI Markup Language) defines the AI interface - the prompt, expected inputs, and structured outputs.

**Files:**

- `clients.baml` - LLM provider configuration
- `agent.baml` - Agent function and data models
- `generators.baml` - Code generation settings

**Key Function: `DecideNextAction`**

This function is the core AI reasoning step. It takes the user's request and conversation history, then returns a structured response.

```baml
function DecideNextAction(
  user_request: string,
  conversation_history: string
) -> AgentResponse {
  client OpenRouterFree
  prompt #"..."#
}
```

**Output Structure:**

```baml
class AgentResponse {
  thought string           // Internal reasoning
  action ToolCall          // Which tool to call
  should_continue bool     // Need more tool calls?
  final_response string?   // Human-friendly response
}

class ToolCall {
  tool ToolName           // Enum of available tools
  reasoning string        // Why this tool
  parameters string       // JSON parameters
}
```

**Why BAML?**

- Type-safe LLM outputs (no manual JSON parsing)
- Clear separation of prompt from code
- Automatic validation of AI responses
- Easy to switch LLM providers

---

### 4. Tool System (`tools.ts`)

The tool system provides concrete actions the AI can take. Each tool is a TypeScript function that performs a specific operation.

**Tool Categories:**

| Category  | Tools                                                                                               | Purpose                       |
| --------- | --------------------------------------------------------------------------------------------------- | ----------------------------- |
| Discovery | `searchProducts`, `getProductDetails`, `getProductReviews`, `compareProducts`, `getRecommendations` | Find and learn about products |
| Cart      | `addToCart`, `removeFromCart`, `updateCartQuantity`, `viewCart`, `clearCart`                        | Manage shopping cart          |
| Wishlist  | `addToWishlist`, `removeFromWishlist`, `viewWishlist`, `moveWishlistToCart`                         | Save items for later          |
| Orders    | `purchaseProduct`, `checkout`, `viewOrders`, `getOrderDetails`                                      | Complete purchases            |

**Tool Signature Pattern:**

```typescript
export async function toolName(
  param1: string,
  param2?: OptionalType
): Promise<ResultType> {
  // 1. Validate inputs
  // 2. Perform operation
  // 3. Return structured result
}
```

**Search Alias System:**

The search system uses keyword aliases to improve product discovery. When a user searches for a general term like "audio", the system expands it to include related keywords. The aliases are carefully chosen to avoid false positives:

```typescript
const SEARCH_ALIASES: Record<string, string[]> = {
  // Audio - specific product terms to avoid matching unrelated items
  audio: ['headphones', 'earbuds', 'speaker', 'echo dot', 'noise cancelling', ...],
  headphones: ['earbuds', 'noise cancelling', 'wh-1000', 'quietcomfort', ...],
  
  // Tech/Accessories
  cables: ['usb', 'cable', 'usb-c'],
  charger: ['usb', 'cable', 'charging', 'fast charging', 'power delivery'],
  
  // Outdoor
  hiking: ['boots', 'trekking', 'trail', 'outdoor', 'waterproof', 'gtx'],
  // ... more aliases
}
```

**Search Strategy:**

The search uses a two-tier matching strategy:

1. **Title Matching** - Uses expanded aliases for broad matching in product titles
2. **Description Matching** - Only uses the exact search term to avoid false positives

```typescript
export async function searchProducts(
  searchTerm: string,
  filters?: FilterOptions
): Promise<SearchResult[]> {
  const searchLower = searchTerm.toLowerCase()
  
  // Expand for title matching only
  const expandedTermsForTitle = [searchLower]
  for (const [key, aliases] of Object.entries(SEARCH_ALIASES)) {
    if (searchLower.includes(key)) {
      expandedTermsForTitle.push(...aliases)
    }
  }
  
  let results = mockData.searchResults.filter((result) => {
    const titleLower = result.title.toLowerCase()
    
    // Check expanded terms against title
    const titleMatch = expandedTermsForTitle.some(term => titleLower.includes(term))
    if (titleMatch) return true
    
    // For description, use exact term only (prevents false positives)
    const details = mockData.productDetails[result.id]
    const descriptionLower = details?.description?.toLowerCase() || ''
    return descriptionLower.includes(searchLower)
  })
  // Apply optional filters...
}
```

---

### 5. Data Layer (`data.ts`)

Manages all application data - both the product catalog and session state.

**Static Data (Product Catalog):**

```typescript
export const mockData = {
  searchResults: SearchResult[]      // Basic product info for search
  productDetails: Record<string, ProductDetails>  // Full product info
  productReviews: Record<string, ProductReview[]> // Customer reviews
}
```

**Session State:**

```typescript
// Shopping cart - persists during session
export const cart: Cart = {
  items: CartItem[]  // Products in cart
  total: number      // Calculated total
}

// Wishlist - saved items
export const wishlist: Wishlist = {
  items: string[]    // Product IDs
}

// Order history
export const orders: Order[] = []
```

**Note:** In a production system, this would be backed by a database. The current in-memory implementation is for demonstration purposes.

---

### 6. UI Utilities (`ui.ts`)

Provides beautiful terminal output with colors, formatting, and visual elements.

**Key Features:**

1. **Color System** - ANSI escape codes for terminal colors
2. **Style Helpers** - Bold, dim, success/error/warning colors
3. **Icons** - Unicode symbols for visual enhancement
4. **Product Cards** - Formatted product display
5. **Tables** - Comparison and list views
6. **Message Boxes** - Feedback notifications

**Example - Product Card:**

```
╭──────────────────────────────────────────────────────╮
│ Anker USB C Cable 6ft - 100W Fast Charging           │
│ ID: USB001                                           │
│ $12.99  ★★★★☆ (4.7)  (45,231 reviews)               │
│ 🚚 Delivery: Fri, Jan 10                             │
│ 🛒 In Cart                                           │
╰──────────────────────────────────────────────────────╯
```

---

## Data Flow

### Complete Request Flow

Let's trace a user request: **"Find me a USB cable under $15"**

```
1. USER INPUT
   │
   │  "Find me a USB cable under $15"
   │
   ▼
2. INDEX.TS - handleInput()
   │
   │  - Validates input is not empty
   │  - Not an exit command
   │  - Sets isProcessing = true
   │
   ▼
3. AGENT.TS - run()
   │
   │  - Adds to conversation history: "User: Find me a USB cable under $15"
   │
   ▼
4. BAML CLIENT - DecideNextAction()
   │
   │  AI receives:
   │  - user_request: "Find me a USB cable under $15"
   │  - conversation_history: "User: Find me a USB cable under $15"
   │
   │  AI thinks:
   │  "User wants USB cables under $15. I should search for USB cables
   │   with a max price filter."
   │
   │  AI returns:
   │  {
   │    thought: "User wants affordable USB cables. Searching with price filter.",
   │    action: {
   │      tool: "SearchProducts",
   │      reasoning: "Need to find USB cables under $15",
   │      parameters: '{"searchTerm": "USB", "filters": {"maxPrice": 15}}'
   │    },
   │    should_continue: true,
   │    final_response: null
   │  }
   │
   ▼
5. AGENT.TS - executeTool()
   │
   │  Parses parameters and calls:
   │  tools.searchProducts("USB", { maxPrice: 15 })
   │
   ▼
6. TOOLS.TS - searchProducts()
   │
   │  - Filters mockData.searchResults for "USB" in title
   │  - Applies maxPrice: 15 filter
   │  - Returns matching products with cart/wishlist status
   │
   │  Result: [
   │    { id: "USB001", title: "Anker USB C...", price: 12.99, ... },
   │    { id: "USB003", title: "Amazon Basics USB-C...", price: 8.99, ... },
   │    { id: "USB004", title: "UGREEN USB C...", price: 14.99, ... }
   │  ]
   │
   ▼
7. AGENT.TS - Adds result to history, loops back to AI
   │
   │  AI sees the search results in conversation history
   │
   │  AI returns:
   │  {
   │    thought: "Found 3 USB cables under $15. Can present results to user.",
   │    action: { tool: "None", ... },
   │    should_continue: false,
   │    final_response: "I found 3 USB cables under $15! The UGREEN cable
   │                     offers the best value with 100W charging at $14.99,
   │                     while Amazon Basics is the cheapest at $8.99."
   │  }
   │
   ▼
8. AGENT.TS - formatFinalResponse()
   │
   │  Combines:
   │  - Formatted product cards from search results
   │  - AI's final response message
   │
   ▼
9. UI.TS - Renders formatted output
   │
   │  Produces colorized, boxed product cards
   │
   ▼
10. INDEX.TS - Displays to user
    │
    │  Resets isProcessing = false
    │  Shows prompt for next input
    │
    ▼
    USER SEES FORMATTED RESULTS
```

---

## AI Agent System

### How the AI Reasons

The AI agent follows a **ReAct (Reasoning + Acting)** pattern:

1. **Observe** - Read the user request and conversation history
2. **Think** - Reason about what information is needed
3. **Act** - Call a tool or provide a response
4. **Repeat** - Continue until task is complete

### Prompt Engineering

The BAML prompt is carefully structured:

```
┌─────────────────────────────────────────────────────┐
│                  SYSTEM CONTEXT                      │
│  "You are an e-commerce shopping assistant..."       │
├─────────────────────────────────────────────────────┤
│                 AVAILABLE TOOLS                      │
│  Detailed list of 15 tools with:                     │
│  - Name and purpose                                  │
│  - Parameter schema                                  │
│  - Usage notes                                       │
├─────────────────────────────────────────────────────┤
│               CURRENT REQUEST                        │
│  User's message + conversation history               │
├─────────────────────────────────────────────────────┤
│                  GUIDELINES                          │
│  Rules for behavior:                                 │
│  - Search before getting details                     │
│  - Confirm before purchasing                         │
│  - Be helpful and proactive                          │
├─────────────────────────────────────────────────────┤
│                OUTPUT FORMAT                         │
│  {{ ctx.output_format }}                             │
│  (BAML inserts the expected JSON schema)             │
└─────────────────────────────────────────────────────┘
```

### Multi-Turn Reasoning

For complex requests, the agent may need multiple tool calls:

**User:** "Add the best-rated USB cable to my cart"

```
Turn 1: SearchProducts("USB cable")
  → Found 5 products

Turn 2: (AI analyzes ratings in results)
  → Identifies UGREEN has highest rating (4.8)

Turn 3: AddToCart("USB004")
  → Added to cart

Turn 4: Return final response
  → "I've added the UGREEN USB C Cable to your cart..."
```

### Context-Aware Actions

The agent maintains product context across separate user requests, enabling natural follow-up actions:

**User:** "Show me the Bose headphones"
```
Agent: Gets product details for HP003 (Bose QuietComfort)
       Stores currentProductContext = { productId: "HP003", title: "Bose QuietComfort..." }
       Shows product info with options: Reviews, Add to Cart, Buy Now, etc.
```

**User:** "Buy now"
```
Agent: Detects contextual phrase "buy now"
       Enriches request: "Buy now [Context: User is referring to Bose QuietComfort... (ID: HP003)]"
       AI uses context to call PurchaseProduct("HP003")
       Returns order confirmation
```

This eliminates the need for users to repeat product IDs when taking action on recently viewed items.

---

## User Interface

### Terminal UI Features

1. **Welcome Banner** - Branded header with feature list
2. **Input Prompt** - Cyan arrow indicator
3. **Loading State** - Animated processing message
4. **Product Cards** - Boxed, colorized product display
5. **Message Boxes** - Success/error/info notifications
6. **Dividers** - Section separators

### Quick Commands

| Command               | Action                         |
| --------------------- | ------------------------------ |
| `help` or `?`         | Show help menu                 |
| `cart`                | View shopping cart             |
| `wishlist`            | View wishlist                  |
| `orders`              | View order history             |
| `clear`               | Clear screen                   |
| `clear history`       | Reset conversation context     |
| `exit` / `quit`       | Exit application               |

### Color Coding

| Color      | Usage                     |
| ---------- | ------------------------- |
| 🟢 Green   | Success, prices           |
| 🔴 Red     | Errors, hearts (wishlist) |
| 🟡 Yellow  | Warnings, stars (ratings) |
| 🔵 Cyan    | Info, prompts             |
| ⚪ Gray    | Muted text, metadata      |
| 🟣 Magenta | Accents, order IDs        |

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required: OpenRouter API Key
OPENROUTER_API_KEY=your_key_here

# Optional: Override model (defaults to free models)
# OPENROUTER_MODEL=tngtech/deepseek-r1t2-chimera:free
```

### LLM Client Configuration

Located in `baml_src/clients.baml`:

```baml
client<llm> DeepSeekChimera {
  provider openai-generic
  options {
    base_url "https://openrouter.ai/api/v1"
    model "tngtech/deepseek-r1t2-chimera:free"
    api_key env.OPENROUTER_API_KEY
  }
}

// Fallback: tries DeepSeek first, then KatCoder
client<llm> OpenRouterFree {
  provider fallback
  options {
    strategy [DeepSeekChimera, KatCoderPro]
  }
}
```

---

## Extending the Application

### Adding a New Tool

1. **Define the tool function in `tools.ts`:**

```typescript
export async function trackPackage(orderId: string): Promise<TrackingInfo> {
  // Implementation
}
```

2. **Add to the BAML enum in `agent.baml`:**

```baml
enum ToolName {
  // ... existing tools
  TrackPackage
}
```

3. **Document in the prompt:**

```
TRACKING:
16. TrackPackage - Track a package shipment
    Parameters: {"orderId": "string"}
```

4. **Handle in `agent.ts` executeTool():**

```typescript
case "TrackPackage":
  return await tools.trackPackage(params.orderId as string)
```

5. **Format the result in `formatToolResult()`:**

```typescript
case "TrackPackage": {
  const tracking = result as TrackingInfo
  // Format for display
}
```

6. **Regenerate BAML client:**

```bash
npx baml-cli generate
```

### Adding New Product Categories

Edit `data.ts` and add entries to:

- `searchResults` - Basic product info
- `productDetails` - Full product details
- `productReviews` - Customer reviews

### Connecting a Real Database

Replace the mock data layer:

1. Create a database service (e.g., `db.ts`)
2. Implement the same function signatures
3. Import database functions in `tools.ts`
4. Add session management for cart/wishlist

### Deploying to Production

1. **API Rate Limiting** - Add throttling for LLM calls
2. **Error Monitoring** - Integrate Sentry or similar
3. **Logging** - Add structured logging
4. **Authentication** - Add user accounts
5. **Database** - Use PostgreSQL/MongoDB
6. **Caching** - Cache product data and AI responses

---

## File Structure Summary

```
ecommerce-concierge/
├── index.ts              # Application entry point
├── agent.ts              # AI agent orchestration
├── tools.ts              # Tool implementations
├── data.ts               # Data layer (products, cart, orders)
├── ui.ts                 # Terminal UI utilities
├── baml_src/             # BAML configuration
│   ├── agent.baml        # Agent function & types
│   ├── clients.baml      # LLM provider config
│   └── generators.baml   # Code generation settings
├── baml_client/          # Generated BAML client (auto-generated)
├── .env                  # Environment variables (create this)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── ARCHITECTURE.md       # This document
```

---

## Conclusion

This architecture provides a clean separation of concerns:

- **UI Layer** - Handles input/output formatting
- **Agent Layer** - Orchestrates AI reasoning and tool execution
- **Tool Layer** - Implements business logic
- **Data Layer** - Manages state and persistence
- **BAML Layer** - Defines AI interface and prompts

The modular design makes it easy to:

- Add new features (tools)
- Change LLM providers
- Connect real data sources
- Deploy to production

For questions or contributions, please open an issue on the repository.
