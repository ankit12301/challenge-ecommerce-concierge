# 🛍️ E-Commerce Shopping Concierge

An AI-powered command-line shopping assistant that helps you discover products, manage your cart, read reviews, compare items, and complete purchases - all through natural conversation.

![Terminal Demo](https://via.placeholder.com/800x400?text=E-Commerce+Concierge+Demo)

## ✨ Features

- 🔍 **Natural Language Search** - "Find me hiking boots under $200"
- 📋 **Product Details & Reviews** - Get comprehensive information
- 🛒 **Shopping Cart** - Add, remove, and manage items
- ❤️ **Wishlist** - Save products for later
- 🔄 **Product Comparison** - Compare items side by side
- 💳 **Easy Checkout** - Complete purchases seamlessly
- 📦 **Order History** - Track your orders
- 🎯 **Smart Recommendations** - AI-powered suggestions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key (free tier available)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce-concierge

# Install dependencies
npm install

# Create environment file
echo "OPENROUTER_API_KEY=your_key_here" > .env

# Start the application
npm start
```

### Get Your API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new key and copy it to your `.env` file

## 💬 Usage Examples

Once started, you can interact naturally:

```
❯ Find me USB cables under $15

❯ Tell me more about the Anker cable

❯ Show reviews for USB004

❯ Add it to my cart

❯ Compare the hiking boots

❯ What's in my wishlist?

❯ Checkout
```

### Quick Commands

| Command | Description |
|---------|-------------|
| `help` | Show help menu |
| `cart` | View shopping cart |
| `wishlist` | View saved items |
| `orders` | View order history |
| `clear` | Clear screen |
| `exit` | Exit application |

## 🏗️ Architecture

```
User Input → Agent → AI (BAML/OpenRouter) → Tools → Data → Formatted Response
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

### Project Structure

```
├── index.ts        # Application entry point
├── agent.ts        # AI agent orchestration
├── tools.ts        # Tool implementations (15+ tools)
├── data.ts         # Product catalog & session state
├── ui.ts           # Terminal UI utilities
├── baml_src/       # AI configuration
│   ├── agent.baml  # Agent prompts & types
│   └── clients.baml # LLM provider config
└── baml_client/    # Generated AI client
```

## 🛠️ Available Tools

| Category | Tools |
|----------|-------|
| **Discovery** | Search, Details, Reviews, Compare, Recommendations |
| **Cart** | Add, Remove, Update, View, Clear |
| **Wishlist** | Add, Remove, View, Move to Cart |
| **Orders** | Purchase, Checkout, View History |

## ⚙️ Configuration

### Environment Variables

```env
# Required
OPENROUTER_API_KEY=your_key_here
```

### Changing LLM Provider

Edit `baml_src/clients.baml` to use different models:

```baml
client<llm> DeepSeekChimera {
  provider openai-generic
  options {
    base_url "https://openrouter.ai/api/v1"
    model "tngtech/deepseek-r1t2-chimera:free"  # Change model here
    api_key env.OPENROUTER_API_KEY
  }
}
```

Then regenerate the client:

```bash
npx baml-cli generate
```

## 🧪 Development

```bash
# Run in development mode
npm start

# Regenerate BAML client after changes
npx baml-cli generate

# Type check
npx tsc --noEmit
```

## 📝 Adding New Products

Edit `data.ts` to add products to:
- `searchResults` - Basic product info
- `productDetails` - Full product details
- `productReviews` - Customer reviews

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [BAML](https://boundaryml.com) - AI function framework
- [OpenRouter](https://openrouter.ai) - LLM API gateway
- DeepSeek & Kat Coder - Free AI models
