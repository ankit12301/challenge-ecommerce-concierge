/**
 * Terminal UI Utilities for E-Commerce Concierge
 * Provides beautiful, consistent formatting for terminal output
 */

// ============================================================================
// ANSI COLOR CODES
// ============================================================================

export const colors = {
  // Basic colors
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  
  // Text colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Bright text colors
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
}

// Box drawing characters
const box = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  tLeft: '├',
  tRight: '┤',
  tTop: '┬',
  tBottom: '┴',
  cross: '┼',
}

// ============================================================================
// STYLE HELPERS
// ============================================================================

export const style = {
  bold: (text: string) => `${colors.bright}${text}${colors.reset}`,
  dim: (text: string) => `${colors.dim}${text}${colors.reset}`,
  italic: (text: string) => `${colors.italic}${text}${colors.reset}`,
  underline: (text: string) => `${colors.underline}${text}${colors.reset}`,
  
  // Colored text
  success: (text: string) => `${colors.brightGreen}${text}${colors.reset}`,
  error: (text: string) => `${colors.brightRed}${text}${colors.reset}`,
  warning: (text: string) => `${colors.brightYellow}${text}${colors.reset}`,
  info: (text: string) => `${colors.brightCyan}${text}${colors.reset}`,
  muted: (text: string) => `${colors.brightBlack}${text}${colors.reset}`,
  accent: (text: string) => `${colors.brightMagenta}${text}${colors.reset}`,
  price: (text: string) => `${colors.brightGreen}${colors.bright}${text}${colors.reset}`,
  highlight: (text: string) => `${colors.brightYellow}${colors.bright}${text}${colors.reset}`,
}

// ============================================================================
// ICONS/SYMBOLS
// ============================================================================

export const icons = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  cart: '🛒',
  heart: '♥',
  star: '★',
  starEmpty: '☆',
  package: '📦',
  truck: '🚚',
  search: '🔍',
  money: '💰',
  tag: '🏷️',
  check: '✔',
  cross: '✖',
  bullet: '•',
  arrow: '→',
  arrowUp: '↑',
  arrowDown: '↓',
  sparkle: '✨',
  fire: '🔥',
  trophy: '🏆',
  clock: '⏰',
  user: '👤',
  store: '🏪',
}

// ============================================================================
// MARKDOWN TO TERMINAL CONVERTER
// ============================================================================

/**
 * Convert markdown formatting to terminal ANSI codes
 */
export function formatMarkdown(text: string): string {
  let result = text
  
  // Convert **bold** to terminal bold
  result = result.replace(/\*\*([^*]+)\*\*/g, `${colors.bright}$1${colors.reset}`)
  
  // Convert *italic* or _italic_ to terminal italic (also handles bold since we use * for emphasis)
  result = result.replace(/\*([^*]+)\*/g, `${colors.bright}$1${colors.reset}`)
  result = result.replace(/_([^_]+)_/g, `${colors.italic}$1${colors.reset}`)
  
  // Convert `code` to highlighted text
  result = result.replace(/`([^`]+)`/g, `${colors.brightCyan}$1${colors.reset}`)
  
  // Convert headers (## Header) to bold with color
  result = result.replace(/^### (.+)$/gm, `\n${colors.brightMagenta}${colors.bright}$1${colors.reset}`)
  result = result.replace(/^## (.+)$/gm, `\n${colors.brightCyan}${colors.bright}$1${colors.reset}`)
  result = result.replace(/^# (.+)$/gm, `\n${colors.brightYellow}${colors.bright}$1${colors.reset}\n`)
  
  // Convert bullet points
  result = result.replace(/^- /gm, `  ${colors.brightCyan}•${colors.reset} `)
  result = result.replace(/^\* /gm, `  ${colors.brightCyan}•${colors.reset} `)
  
  // Convert numbered lists with emojis (1️⃣, 2️⃣, etc.) - keep as is but ensure spacing
  result = result.replace(/^(\d+)\. /gm, `  ${colors.brightCyan}$1.${colors.reset} `)
  
  // Convert > blockquotes
  result = result.replace(/^> (.+)$/gm, `  ${colors.brightBlack}│${colors.reset} ${colors.italic}$1${colors.reset}`)
  
  // Convert --- horizontal rules
  result = result.replace(/^---$/gm, `${colors.brightBlack}${'─'.repeat(50)}${colors.reset}`)
  
  // Clean up any double newlines
  result = result.replace(/\n{3,}/g, '\n\n')
  
  return result
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Remove ANSI codes for length calculation
 */
function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '')
}

/**
 * Get visible length of string (excluding ANSI codes)
 */
function visibleLength(text: string): number {
  return stripAnsi(text).length
}

/**
 * Pad string to width, accounting for ANSI codes
 */
function padEnd(text: string, width: number): string {
  const visible = visibleLength(text)
  return text + ' '.repeat(Math.max(0, width - visible))
}

/**
 * Center text within width
 */
function centerText(text: string, width: number): string {
  const visible = visibleLength(text)
  const padding = Math.max(0, width - visible)
  const leftPad = Math.floor(padding / 2)
  const rightPad = padding - leftPad
  return ' '.repeat(leftPad) + text + ' '.repeat(rightPad)
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

/**
 * Create a decorative header box
 */
export function header(title: string, subtitle?: string): string {
  const width = 56
  const innerWidth = width - 2
  
  const lines: string[] = []
  const borderColor = colors.brightCyan
  const titleColor = colors.brightWhite + colors.bright
  const subtitleColor = colors.brightBlack
  
  lines.push('')
  lines.push(`${borderColor}${box.topLeft}${box.horizontal.repeat(innerWidth)}${box.topRight}${colors.reset}`)
  lines.push(`${borderColor}${box.vertical}${colors.reset}${centerText(`${titleColor}${title}${colors.reset}`, innerWidth)}${borderColor}${box.vertical}${colors.reset}`)
  
  if (subtitle) {
    lines.push(`${borderColor}${box.vertical}${colors.reset}${centerText(`${subtitleColor}${subtitle}${colors.reset}`, innerWidth)}${borderColor}${box.vertical}${colors.reset}`)
  }
  
  lines.push(`${borderColor}${box.bottomLeft}${box.horizontal.repeat(innerWidth)}${box.bottomRight}${colors.reset}`)
  lines.push('')
  
  return lines.join('\n')
}

/**
 * Create a section divider
 */
export function divider(title?: string): string {
  const width = 56
  if (!title) {
    return `${colors.brightBlack}${'─'.repeat(width)}${colors.reset}`
  }
  const titleWithPadding = ` ${title} `
  const remaining = width - titleWithPadding.length - 2
  const leftDash = Math.floor(remaining / 2)
  const rightDash = remaining - leftDash
  return `${colors.brightBlack}${'─'.repeat(leftDash)}${colors.reset} ${style.muted(title)} ${colors.brightBlack}${'─'.repeat(rightDash)}${colors.reset}`
}

/**
 * Format a product card for display
 */
export function productCard(product: {
  id: string
  title: string
  price: number
  rating: number
  numRatings?: number
  deliveryDate?: string
  inCart?: boolean
  inWishlist?: boolean
}): string {
  const lines: string[] = []
  const width = 54
  
  // Title (truncate if needed)
  const maxTitleLength = width - 4
  const title = product.title.length > maxTitleLength 
    ? product.title.substring(0, maxTitleLength - 3) + '...'
    : product.title
  
  // Build status badges
  const badges: string[] = []
  if (product.inCart) badges.push(`${style.success(icons.cart)} In Cart`)
  if (product.inWishlist) badges.push(`${style.error(icons.heart)} Saved`)
  
  lines.push(`${colors.brightBlack}${box.topLeft}${box.horizontal.repeat(width)}${box.topRight}${colors.reset}`)
  lines.push(`${colors.brightBlack}${box.vertical}${colors.reset} ${style.bold(title)}${' '.repeat(Math.max(0, width - visibleLength(title) - 1))}${colors.brightBlack}${box.vertical}${colors.reset}`)
  lines.push(`${colors.brightBlack}${box.vertical}${colors.reset} ${style.muted(`ID: ${product.id}`)}${' '.repeat(Math.max(0, width - product.id.length - 5))}${colors.brightBlack}${box.vertical}${colors.reset}`)
  
  // Price and rating line
  const priceStr = `${style.price(`$${product.price.toFixed(2)}`)}  ${renderStars(product.rating)}`
  const ratingsStr = product.numRatings ? style.muted(`(${product.numRatings.toLocaleString()} reviews)`) : ''
  const priceLine = `${priceStr} ${ratingsStr}`
  lines.push(`${colors.brightBlack}${box.vertical}${colors.reset} ${priceLine}${' '.repeat(Math.max(0, width - visibleLength(priceLine) - 1))}${colors.brightBlack}${box.vertical}${colors.reset}`)
  
  // Delivery date
  if (product.deliveryDate) {
    const deliveryStr = `${icons.truck} Delivery: ${formatDate(product.deliveryDate)}`
    lines.push(`${colors.brightBlack}${box.vertical}${colors.reset} ${style.info(deliveryStr)}${' '.repeat(Math.max(0, width - visibleLength(deliveryStr) - 1))}${colors.brightBlack}${box.vertical}${colors.reset}`)
  }
  
  // Status badges
  if (badges.length > 0) {
    const badgeLine = badges.join('  ')
    lines.push(`${colors.brightBlack}${box.vertical}${colors.reset} ${badgeLine}${' '.repeat(Math.max(0, width - visibleLength(badgeLine) - 1))}${colors.brightBlack}${box.vertical}${colors.reset}`)
  }
  
  lines.push(`${colors.brightBlack}${box.bottomLeft}${box.horizontal.repeat(width)}${box.bottomRight}${colors.reset}`)
  
  return lines.join('\n')
}

/**
 * Render star rating
 */
export function renderStars(rating: number, maxStars: number = 5): string {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)
  
  let stars = ''
  stars += `${colors.brightYellow}${icons.star.repeat(fullStars)}${colors.reset}`
  if (hasHalfStar) stars += `${colors.yellow}${icons.star}${colors.reset}`
  stars += `${colors.brightBlack}${icons.starEmpty.repeat(emptyStars)}${colors.reset}`
  stars += ` ${style.muted(`(${rating.toFixed(1)})`)}`
  
  return stars
}

/**
 * Format date to human-readable
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('en-US', options)
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

/**
 * Create a message box (for responses, errors, etc.)
 */
export function messageBox(
  message: string, 
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
): string {
  const iconMap = {
    success: { icon: icons.success, color: colors.brightGreen },
    error: { icon: icons.error, color: colors.brightRed },
    warning: { icon: icons.warning, color: colors.brightYellow },
    info: { icon: icons.info, color: colors.brightCyan },
  }
  
  const { icon, color } = iconMap[type]
  // Format markdown in the message
  const formattedMessage = formatMarkdown(message)
  return `\n${color}${icon}${colors.reset} ${formattedMessage}\n`
}

/**
 * Wrap text to specified width
 */
export function wrapText(text: string, width: number = 70): string {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine ? ' ' : '') + word
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  
  return lines.join('\n')
}

/**
 * Format a review for display
 */
export function formatReview(review: {
  rating: number
  comment: string
  date: string
}): string {
  const lines: string[] = []
  lines.push(`  ${renderStars(review.rating)} ${style.muted(formatDate(review.date))}`)
  lines.push(`  ${style.italic(`"${review.comment}"`)}`)
  return lines.join('\n')
}

/**
 * Create a simple table
 */
export function table(headers: string[], rows: string[][]): string {
  const colWidths = headers.map((h, i) => {
    const maxRowWidth = Math.max(...rows.map(r => visibleLength(r[i] || '')))
    return Math.max(visibleLength(h), maxRowWidth)
  })
  
  const lines: string[] = []
  
  // Header
  const headerRow = headers.map((h, i) => padEnd(style.bold(h), colWidths[i])).join('  ')
  lines.push(headerRow)
  lines.push(colWidths.map(w => '─'.repeat(w)).join('──'))
  
  // Rows
  for (const row of rows) {
    const formattedRow = row.map((cell, i) => padEnd(cell, colWidths[i])).join('  ')
    lines.push(formattedRow)
  }
  
  return lines.join('\n')
}

/**
 * Format cart summary
 */
export function cartSummary(items: Array<{
  title: string
  price: number
  quantity: number
}>, total: number): string {
  const lines: string[] = []
  
  lines.push('')
  lines.push(divider(`${icons.cart} Shopping Cart`))
  lines.push('')
  
  if (items.length === 0) {
    lines.push(`  ${style.muted('Your cart is empty')}`)
  } else {
    for (const item of items) {
      const titleTrunc = item.title.length > 40 ? item.title.substring(0, 37) + '...' : item.title
      lines.push(`  ${icons.bullet} ${titleTrunc}`)
      lines.push(`    ${style.muted(`Qty: ${item.quantity}`)}  ${style.price(formatPrice(item.price * item.quantity))}`)
    }
    lines.push('')
    lines.push(divider())
    lines.push(`  ${style.bold('Total:')} ${style.price(formatPrice(total))}`)
  }
  
  lines.push('')
  return lines.join('\n')
}

/**
 * Format product comparison table
 */
export function comparisonTable(products: Array<{
  title: string
  price: number
  rating: number
  features?: string[]
}>): string {
  const lines: string[] = []
  
  lines.push('')
  lines.push(divider(`${icons.search} Product Comparison`))
  lines.push('')
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const num = i + 1
    lines.push(`${style.accent(`[${num}]`)} ${style.bold(p.title.substring(0, 50))}${p.title.length > 50 ? '...' : ''}`)
    lines.push(`    ${style.price(formatPrice(p.price))}  ${renderStars(p.rating)}`)
    if (p.features && p.features.length > 0) {
      lines.push(`    ${style.muted(p.features.slice(0, 3).join(' • '))}`)
    }
    lines.push('')
  }
  
  return lines.join('\n')
}

/**
 * Help menu
 */
export function helpMenu(): string {
  const lines: string[] = []
  
  lines.push('')
  lines.push(header('Help & Commands', 'How to use the Shopping Concierge'))
  
  const commands = [
    ['Search products', '"Find laptops under $1000"'],
    ['Get details', '"Tell me more about product HB001"'],
    ['Read reviews', '"Show reviews for the Salomon boots"'],
    ['Add to cart', '"Add the Anker cable to my cart"'],
    ['View cart', '"Show my cart"'],
    ['Add to wishlist', '"Save the Echo Dot for later"'],
    ['View wishlist', '"Show my wishlist"'],
    ['Compare products', '"Compare the hiking boots"'],
    ['Purchase', '"Buy product USB001"'],
    ['View orders', '"Show my orders"'],
    ['Filter', '"Find cables under $15 with 4+ stars"'],
  ]
  
  lines.push(style.bold('  Example Commands:'))
  lines.push('')
  
  for (const [action, example] of commands) {
    lines.push(`  ${style.info(icons.arrow)} ${style.bold(action)}`)
    lines.push(`    ${style.muted(example)}`)
  }
  
  lines.push('')
  lines.push(`  ${style.muted('Type "exit" or "quit" to end your session')}`)
  lines.push('')
  
  return lines.join('\n')
}

/**
 * Welcome banner
 */
export function welcomeBanner(): string {
  const lines: string[] = []
  
  lines.push('')
  lines.push(`${colors.brightCyan}`)
  lines.push(`    ╔═══════════════════════════════════════════════════════╗`)
  lines.push(`    ║                                                       ║`)
  lines.push(`    ║   ${colors.brightWhite}${colors.bright}🛍️  E-Commerce Shopping Concierge${colors.reset}${colors.brightCyan}             ║`)
  lines.push(`    ║                                                       ║`)
  lines.push(`    ║   ${colors.reset}${style.muted('Your AI-powered personal shopping assistant')}${colors.brightCyan}     ║`)
  lines.push(`    ║                                                       ║`)
  lines.push(`    ╚═══════════════════════════════════════════════════════╝`)
  lines.push(`${colors.reset}`)
  lines.push('')
  lines.push(`  ${style.info(icons.sparkle)} ${style.bold('Welcome!')} I can help you:`)
  lines.push('')
  lines.push(`     ${icons.search}  Search and discover products`)
  lines.push(`     ${icons.star}  Read reviews and compare options`)
  lines.push(`     ${icons.cart}  Manage your shopping cart`)
  lines.push(`     ${icons.heart}  Save items to your wishlist`)
  lines.push(`     ${icons.package}  Complete purchases`)
  lines.push('')
  lines.push(`  ${style.muted(`Type ${style.info('"help"')} for commands or just ask naturally!`)}`)
  lines.push('')
  
  return lines.join('\n')
}

/**
 * Loading indicator
 */
export function loadingMessage(message: string = 'Processing'): string {
  return `\n${colors.brightCyan}⏳${colors.reset} ${style.muted(message + '...')}\n`
}

/**
 * Order confirmation
 */
export function orderConfirmation(order: {
  orderId: string
  items: Array<{ title: string; price: number; quantity: number }>
  total: number
  estimatedDelivery?: string
}): string {
  const lines: string[] = []
  
  lines.push('')
  lines.push(`${colors.brightGreen}`)
  lines.push(`  ╔═══════════════════════════════════════════╗`)
  lines.push(`  ║         ${icons.success} ORDER CONFIRMED!             ║`)
  lines.push(`  ╚═══════════════════════════════════════════╝`)
  lines.push(`${colors.reset}`)
  lines.push('')
  lines.push(`  ${style.bold('Order ID:')} ${style.accent(order.orderId)}`)
  lines.push('')
  
  for (const item of order.items) {
    lines.push(`  ${icons.package} ${item.title.substring(0, 40)}${item.title.length > 40 ? '...' : ''}`)
    lines.push(`    ${style.muted(`Qty: ${item.quantity}`)} × ${formatPrice(item.price)}`)
  }
  
  lines.push('')
  lines.push(divider())
  lines.push(`  ${style.bold('Total Paid:')} ${style.price(formatPrice(order.total))}`)
  
  if (order.estimatedDelivery) {
    lines.push(`  ${icons.truck} ${style.info(`Estimated Delivery: ${formatDate(order.estimatedDelivery)}`)}`)
  }
  
  lines.push('')
  lines.push(`  ${style.success('Thank you for your purchase!')} ${icons.sparkle}`)
  lines.push('')
  
  return lines.join('\n')
}

/**
 * Format AI response with proper terminal styling
 */
export function formatResponse(text: string): string {
  return formatMarkdown(text)
}
