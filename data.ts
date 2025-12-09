import { ProductDetails, ProductReview, SearchResult } from "./tools"

// ============================================================================
// CART & WISHLIST TYPES
// ============================================================================

export type CartItem = {
  productId: string
  title: string
  price: number
  quantity: number
}

export type Cart = {
  items: CartItem[]
  total: number
}

export type Wishlist = {
  items: string[] // Array of product IDs
}

export type Order = {
  orderId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  orderDate: string
  estimatedDelivery?: string
}

// ============================================================================
// SESSION STATE (In-memory storage for demo)
// ============================================================================

/**
 * Shopping cart - persists during the session
 */
export const cart: Cart = {
  items: [],
  total: 0,
}

/**
 * Wishlist - persists during the session
 */
export const wishlist: Wishlist = {
  items: [],
}

/**
 * Order history - persists during the session
 */
export const orders: Order[] = []

// ============================================================================
// PRODUCT CATALOG DATA
// ============================================================================

/**
 * Mock data for the ecommerce concierge.
 * Comprehensive product catalog with multiple categories.
 */
export const mockData: {
  searchResults: SearchResult[]
  productDetails: Record<string, ProductDetails>
  productReviews: Record<string, ProductReview[]>
} = {
  searchResults: [
    // Smart Home & Electronics
    {
      id: "B08N5WRWNW",
      title: "Echo Dot (4th Gen) | Smart speaker with Alexa | Charcoal",
      price: 49.99,
      rating: 4.5,
      numRatings: 123456,
      deliveryDate: "2025-01-15",
    },
    
    // Hiking Boots Category
    {
      id: "HB001",
      title: "Salomon Quest 4 GTX Hiking Boots - Men's Waterproof Trekking Shoes",
      price: 229.95,
      rating: 4.8,
      numRatings: 3421,
      deliveryDate: "2025-01-12",
    },
    {
      id: "HB002",
      title: "Merrell Moab 3 Mid Waterproof Hiking Boots - All Terrain Trekking",
      price: 149.99,
      rating: 4.6,
      numRatings: 8934,
      deliveryDate: "2025-01-13",
    },
    {
      id: "HB003",
      title: "La Sportiva Nepal Extreme GTX - High Altitude Mountaineering Boots",
      price: 599.00,
      rating: 4.9,
      numRatings: 892,
      deliveryDate: "2025-01-18",
    },
    {
      id: "HB004",
      title: "Columbia Newton Ridge Plus Waterproof Hiking Boot - Budget Trek Shoes",
      price: 89.99,
      rating: 4.3,
      numRatings: 15432,
      deliveryDate: "2025-01-11",
    },
    
    // USB Cables Category
    {
      id: "USB001",
      title: "Anker USB C to USB C Cable 6ft (2m) - 100W Fast Charging",
      price: 12.99,
      rating: 4.7,
      numRatings: 45231,
      deliveryDate: "2025-01-10",
    },
    {
      id: "USB002",
      title: "Apple USB-C Charge Cable 2m - Premium Braided Design",
      price: 29.00,
      rating: 4.5,
      numRatings: 8932,
      deliveryDate: "2025-01-14",
    },
    {
      id: "USB003",
      title: "Amazon Basics USB-C to USB-C 2.0 Cable 6ft - Value Pack",
      price: 8.99,
      rating: 4.4,
      numRatings: 67543,
      deliveryDate: "2025-01-10",
    },
    {
      id: "USB004",
      title: "UGREEN USB C Cable 2M 100W PD Fast Charging - Braided Nylon",
      price: 14.99,
      rating: 4.8,
      numRatings: 23451,
      deliveryDate: "2025-01-11",
    },
    {
      id: "USB005",
      title: "Cable Matters USB-C Cable 2m - USB 3.2 Gen 2 10Gbps Data Transfer",
      price: 19.99,
      rating: 4.6,
      numRatings: 5621,
      deliveryDate: "2025-01-12",
    },
    
    // Headphones Category
    {
      id: "HP001",
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Premium ANC",
      price: 348.00,
      rating: 4.8,
      numRatings: 12543,
      deliveryDate: "2025-01-13",
    },
    {
      id: "HP002",
      title: "Apple AirPods Pro (2nd Gen) - Active Noise Cancellation",
      price: 249.00,
      rating: 4.7,
      numRatings: 89234,
      deliveryDate: "2025-01-11",
    },
    {
      id: "HP003",
      title: "Bose QuietComfort Ultra Headphones - Spatial Audio",
      price: 429.00,
      rating: 4.6,
      numRatings: 5432,
      deliveryDate: "2025-01-14",
    },
    
    // Laptop Accessories
    {
      id: "LA001",
      title: "Logitech MX Master 3S - Wireless Performance Mouse",
      price: 99.99,
      rating: 4.8,
      numRatings: 34521,
      deliveryDate: "2025-01-10",
    },
    {
      id: "LA002",
      title: "Keychron K3 Pro - 75% Low Profile Mechanical Keyboard",
      price: 109.00,
      rating: 4.7,
      numRatings: 8934,
      deliveryDate: "2025-01-12",
    },
  ],
  
  productDetails: {
    // Smart Home
    B08N5WRWNW: {
      id: "B08N5WRWNW",
      title: "Echo Dot (4th Gen) | Smart speaker with Alexa | Charcoal",
      price: 49.99,
      rating: 4.5,
      numRatings: 123456,
      description:
        "Meet the Echo Dot - Our most popular smart speaker with Alexa. The sleek, compact design delivers crisp vocals and balanced bass for full sound. Control smart home devices, play music, get weather updates, and more with just your voice.",
      images: [
        "https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg",
      ],
      deliveryDate: "2025-01-15",
    },
    
    // Hiking Boots
    HB001: {
      id: "HB001",
      title: "Salomon Quest 4 GTX Hiking Boots - Men's Waterproof Trekking Shoes",
      price: 229.95,
      rating: 4.8,
      numRatings: 3421,
      description:
        "Premium hiking boots with GORE-TEX waterproofing, advanced chassis for ankle support, and Contagrip outsole. Perfect for multi-day treks and challenging terrain including Himalayan expeditions. Features 4D Advanced Chassis for stability on rough terrain.",
      images: ["https://example.com/salomon-quest4.jpg"],
      deliveryDate: "2025-01-12",
    },
    HB002: {
      id: "HB002",
      title: "Merrell Moab 3 Mid Waterproof Hiking Boots - All Terrain Trekking",
      price: 149.99,
      rating: 4.6,
      numRatings: 8934,
      description:
        "Versatile hiking boots with waterproof membrane, cushioned midsole, and Vibram TC5+ outsole. Great balance of comfort and durability for day hikes and moderate treks. Bellows tongue keeps debris out.",
      images: ["https://example.com/merrell-moab3.jpg"],
      deliveryDate: "2025-01-13",
    },
    HB003: {
      id: "HB003",
      title: "La Sportiva Nepal Extreme GTX - High Altitude Mountaineering Boots",
      price: 599.00,
      rating: 4.9,
      numRatings: 892,
      description:
        "Professional mountaineering boots designed for extreme high-altitude expeditions. Features Vibram sole, GORE-TEX Insulated Comfort lining, and crampon-compatible. Used by mountaineers on Everest and K2. Exceptional warmth down to -40°C.",
      images: ["https://example.com/lasportiva-nepal.jpg"],
      deliveryDate: "2025-01-18",
    },
    HB004: {
      id: "HB004",
      title: "Columbia Newton Ridge Plus Waterproof Hiking Boot - Budget Trek Shoes",
      price: 89.99,
      rating: 4.3,
      numRatings: 15432,
      description:
        "Affordable waterproof hiking boots with Omni-Grip rubber outsole and cushioned midsole. Good for casual hiking and light trails. May not provide sufficient support for extreme conditions or heavy backpacking.",
      images: ["https://example.com/columbia-newton.jpg"],
      deliveryDate: "2025-01-11",
    },
    
    // USB Cables
    USB001: {
      id: "USB001",
      title: "Anker USB C to USB C Cable 6ft (2m) - 100W Fast Charging",
      price: 12.99,
      rating: 4.7,
      numRatings: 45231,
      description:
        "High-quality USB-C cable supporting 100W Power Delivery for fast charging of laptops and phones. Durable design with 10,000+ bend lifespan. USB 2.0 data transfer speeds. Excellent value for money with Anker's reliability.",
      images: ["https://example.com/anker-usbc.jpg"],
      deliveryDate: "2025-01-10",
    },
    USB002: {
      id: "USB002",
      title: "Apple USB-C Charge Cable 2m - Premium Braided Design",
      price: 29.00,
      rating: 4.5,
      numRatings: 8932,
      description:
        "Official Apple USB-C cable with woven design for durability. Supports fast charging for iPhone 15 and MacBook. Premium build quality but limited to 60W charging. More expensive than alternatives with similar specs.",
      images: ["https://example.com/apple-usbc.jpg"],
      deliveryDate: "2025-01-14",
    },
    USB003: {
      id: "USB003",
      title: "Amazon Basics USB-C to USB-C 2.0 Cable 6ft - Value Pack",
      price: 8.99,
      rating: 4.4,
      numRatings: 67543,
      description:
        "Budget-friendly USB-C cable for basic charging and data transfer. Supports up to 60W charging. Basic build quality, may not last as long as premium options. Great for everyday use but not for heavy-duty applications.",
      images: ["https://example.com/amazonbasics-usbc.jpg"],
      deliveryDate: "2025-01-10",
    },
    USB004: {
      id: "USB004",
      title: "UGREEN USB C Cable 2M 100W PD Fast Charging - Braided Nylon",
      price: 14.99,
      rating: 4.8,
      numRatings: 23451,
      description:
        "Premium braided nylon USB-C cable with 100W Power Delivery support. Aluminum alloy connectors resist corrosion. USB 2.0 speeds. Excellent durability with 25,000+ bend tests. Best value for money in the 2m category.",
      images: ["https://example.com/ugreen-usbc.jpg"],
      deliveryDate: "2025-01-11",
    },
    USB005: {
      id: "USB005",
      title: "Cable Matters USB-C Cable 2m - USB 3.2 Gen 2 10Gbps Data Transfer",
      price: 19.99,
      rating: 4.6,
      numRatings: 5621,
      description:
        "High-speed USB-C cable with 10Gbps data transfer and 100W charging. Ideal for transferring large files quickly. Supports 4K@60Hz video. More expensive but justified if you need fast data transfer speeds.",
      images: ["https://example.com/cablematters-usbc.jpg"],
      deliveryDate: "2025-01-12",
    },
    
    // Headphones
    HP001: {
      id: "HP001",
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Premium ANC",
      price: 348.00,
      rating: 4.8,
      numRatings: 12543,
      description:
        "Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life, multipoint connection, speak-to-chat technology. Ultra-comfortable design with soft-fit leather. Crystal clear hands-free calling with 8 microphones.",
      images: ["https://example.com/sony-xm5.jpg"],
      deliveryDate: "2025-01-13",
    },
    HP002: {
      id: "HP002",
      title: "Apple AirPods Pro (2nd Gen) - Active Noise Cancellation",
      price: 249.00,
      rating: 4.7,
      numRatings: 89234,
      description:
        "Apple's premium true wireless earbuds with H2 chip for breakthrough audio. Adaptive Transparency, Personalized Spatial Audio with dynamic head tracking. Up to 6 hours of listening time. MagSafe charging case with precision finding.",
      images: ["https://example.com/airpods-pro.jpg"],
      deliveryDate: "2025-01-11",
    },
    HP003: {
      id: "HP003",
      title: "Bose QuietComfort Ultra Headphones - Spatial Audio",
      price: 429.00,
      rating: 4.6,
      numRatings: 5432,
      description:
        "Bose's flagship headphones with world-class noise cancellation and Immersive Audio. CustomTune technology adapts sound to your ears. 24 hours of battery. Premium materials and exceptional comfort for all-day wear.",
      images: ["https://example.com/bose-qc-ultra.jpg"],
      deliveryDate: "2025-01-14",
    },
    
    // Laptop Accessories
    LA001: {
      id: "LA001",
      title: "Logitech MX Master 3S - Wireless Performance Mouse",
      price: 99.99,
      rating: 4.8,
      numRatings: 34521,
      description:
        "Advanced wireless mouse with MagSpeed electromagnetic scrolling. 8K DPI optical sensor tracks on any surface including glass. Quiet clicks, ergonomic design. Connect up to 3 devices with Easy-Switch. USB-C quick charging.",
      images: ["https://example.com/mx-master-3s.jpg"],
      deliveryDate: "2025-01-10",
    },
    LA002: {
      id: "LA002",
      title: "Keychron K3 Pro - 75% Low Profile Mechanical Keyboard",
      price: 109.00,
      rating: 4.7,
      numRatings: 8934,
      description:
        "Ultra-slim wireless mechanical keyboard with hot-swappable low-profile Gateron switches. QMK/VIA support for full customization. RGB backlight, Mac and Windows compatible. Bluetooth 5.1 connects up to 3 devices. Aluminum frame.",
      images: ["https://example.com/keychron-k3-pro.jpg"],
      deliveryDate: "2025-01-12",
    },
  },
  
  productReviews: {
    B08N5WRWNW: [
      {
        rating: 5,
        comment: "Great smart speaker! Sound quality exceeded my expectations for the price. Alexa works flawlessly.",
        date: "2024-12-15",
      },
      {
        rating: 4,
        comment: "Good value, but wish the bass was a bit stronger. Perfect for smart home control.",
        date: "2024-11-20",
      },
      {
        rating: 5,
        comment: "Bought three for different rooms. The intercom feature between them is fantastic!",
        date: "2024-10-30",
      },
    ],
    
    HB001: [
      {
        rating: 5,
        comment: "Used these on a 2-week trek in Nepal. Excellent ankle support and waterproofing held up perfectly even in monsoon conditions.",
        date: "2024-11-20",
      },
      {
        rating: 5,
        comment: "Best hiking boots I've owned. The grip on wet rocks is phenomenal.",
        date: "2024-10-15",
      },
      {
        rating: 4,
        comment: "Great boots but took about 20 miles to break in. Worth the wait though.",
        date: "2024-09-08",
      },
    ],
    HB002: [
      {
        rating: 5,
        comment: "Comfortable right out of the box. Did a 50-mile trek with no blisters.",
        date: "2024-11-01",
      },
      {
        rating: 4,
        comment: "Good value boots. Not as premium as Salomon but get the job done well.",
        date: "2024-10-22",
      },
      {
        rating: 5,
        comment: "Third pair of Moabs I've bought. They never disappoint for day hikes and weekend trips.",
        date: "2024-09-30",
      },
    ],
    HB003: [
      {
        rating: 5,
        comment: "Summited Island Peak in these. Kept my feet warm at -30°C. Worth every penny for serious mountaineering.",
        date: "2024-10-05",
      },
      {
        rating: 5,
        comment: "Professional grade boots. Crampon compatible and extremely durable. Used on multiple 6000m+ peaks.",
        date: "2024-08-12",
      },
      {
        rating: 4,
        comment: "Excellent boots but very stiff. Only suitable for technical mountaineering, not regular hiking.",
        date: "2024-07-20",
      },
    ],
    HB004: [
      {
        rating: 4,
        comment: "Great starter boots for the price. Used them on several day hikes without issues.",
        date: "2024-11-10",
      },
      {
        rating: 3,
        comment: "Decent for casual hiking but wouldn't trust them for serious trekking. You get what you pay for.",
        date: "2024-10-01",
      },
      {
        rating: 5,
        comment: "Perfect for light trails and walks. Very comfortable for the price point.",
        date: "2024-09-15",
      },
    ],
    
    USB001: [
      {
        rating: 5,
        comment: "Anker quality as expected. Charges my MacBook Pro at full speed. Cable feels very durable.",
        date: "2024-11-25",
      },
      {
        rating: 5,
        comment: "Best value USB-C cable on the market. Fast charging works perfectly.",
        date: "2024-11-15",
      },
      {
        rating: 4,
        comment: "Solid cable. Only minor complaint is it's not quite as flexible as I'd like.",
        date: "2024-10-28",
      },
    ],
    USB002: [
      {
        rating: 4,
        comment: "Nice quality cable but overpriced compared to alternatives with same specs.",
        date: "2024-11-20",
      },
      {
        rating: 5,
        comment: "Perfect for my iPhone 15 and iPad. The braided design looks premium.",
        date: "2024-10-30",
      },
      {
        rating: 3,
        comment: "Good cable but not worth double the price of Anker for essentially same performance.",
        date: "2024-10-10",
      },
    ],
    USB003: [
      {
        rating: 4,
        comment: "Can't beat the price. Does basic charging fine. Not the most durable but good enough.",
        date: "2024-11-28",
      },
      {
        rating: 5,
        comment: "Perfect for everyday use. At this price I can have one in every room.",
        date: "2024-11-05",
      },
      {
        rating: 3,
        comment: "Cheap and works but connector feels loose after a few months. You get what you pay for.",
        date: "2024-09-20",
      },
    ],
    USB004: [
      {
        rating: 5,
        comment: "Outstanding cable! Braided design is super durable and the 100W charging is fast. Best value for money.",
        date: "2024-11-22",
      },
      {
        rating: 5,
        comment: "Been using for 6 months daily, still perfect. The build quality is impressive for the price.",
        date: "2024-11-01",
      },
      {
        rating: 5,
        comment: "Better than my Apple cable at half the price. Highly recommend.",
        date: "2024-10-18",
      },
    ],
    USB005: [
      {
        rating: 5,
        comment: "The data transfer speeds are incredible. Essential if you move large video files.",
        date: "2024-11-18",
      },
      {
        rating: 4,
        comment: "Great cable for fast data transfer but pricey if you just need charging.",
        date: "2024-10-25",
      },
      {
        rating: 5,
        comment: "USB 3.2 speeds are worth it for my workflow. Also charges fast.",
        date: "2024-09-28",
      },
    ],
    
    HP001: [
      {
        rating: 5,
        comment: "Best noise cancelling I've ever experienced. Perfect for flights and open offices.",
        date: "2024-12-01",
      },
      {
        rating: 5,
        comment: "Sound quality is exceptional. The auto-pause when removing is so convenient.",
        date: "2024-11-15",
      },
      {
        rating: 4,
        comment: "Amazing headphones but wish they folded flat like the XM4.",
        date: "2024-10-20",
      },
    ],
    HP002: [
      {
        rating: 5,
        comment: "Seamless with my Apple devices. The spatial audio is mind-blowing for movies.",
        date: "2024-12-05",
      },
      {
        rating: 4,
        comment: "Great earbuds but battery life could be better. Still the best for iPhone users.",
        date: "2024-11-18",
      },
      {
        rating: 5,
        comment: "Noise cancellation is perfect for commuting. Adaptive transparency is a game changer.",
        date: "2024-10-25",
      },
    ],
    HP003: [
      {
        rating: 5,
        comment: "The comfort is unmatched. I can wear these all day without any fatigue.",
        date: "2024-11-28",
      },
      {
        rating: 4,
        comment: "Excellent sound and ANC but pricey. Worth it if comfort is your priority.",
        date: "2024-11-10",
      },
      {
        rating: 5,
        comment: "Immersive Audio feature is incredible. Best for music enthusiasts.",
        date: "2024-10-15",
      },
    ],
    
    LA001: [
      {
        rating: 5,
        comment: "Best mouse I've ever used. The scroll wheel is addictive and the ergonomics are perfect.",
        date: "2024-12-03",
      },
      {
        rating: 5,
        comment: "Quiet clicks are a blessing in meetings. Works flawlessly on any surface.",
        date: "2024-11-20",
      },
      {
        rating: 4,
        comment: "Excellent mouse but expensive. The multi-device switching is worth it for my setup.",
        date: "2024-10-28",
      },
    ],
    LA002: [
      {
        rating: 5,
        comment: "Perfect for travel. Low profile feels great and the build quality is premium.",
        date: "2024-11-25",
      },
      {
        rating: 5,
        comment: "Hot-swap switches are amazing. Customized with my favorite switches easily.",
        date: "2024-11-08",
      },
      {
        rating: 4,
        comment: "Great keyboard but took some time to adjust from a full-size. Love the RGB.",
        date: "2024-10-15",
      },
    ],
  },
}
