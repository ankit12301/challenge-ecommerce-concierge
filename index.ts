// Load environment variables FIRST (before anything else)
import 'dotenv/config'

// Check if we're in debug/dev mode IMMEDIATELY
const isDebugMode = process.env.DEBUG === 'true' || process.env.DEV_MODE === 'true'

// ============================================================================
// SUPPRESS BAML LOGS IN PRODUCTION - Must be before any BAML imports!
// ============================================================================

if (!isDebugMode) {
  // Set BAML log level
  process.env.BAML_LOG = 'error'
  
  // Store original stdout.write
  const originalStdoutWrite = process.stdout.write.bind(process.stdout)
  const originalStderrWrite = process.stderr.write.bind(process.stderr)
  
  // Pattern to detect BAML logs
  const isBamlOutput = (text: string): boolean => {
    return /\[BAML (INFO|WARN|ERROR)\]/.test(text) ||
           text.includes('---PROMPT---') ||
           text.includes('---LLM REPLY---') ||
           text.includes('---Parsed Response') ||
           /Client:.*StopReason:/.test(text) ||
           /Tokens\(in\/out\):/.test(text) ||
           /^\s{4}system:/.test(text) ||
           /^\s{4}user:/.test(text) ||
           /^\s{4}assistant:/.test(text) ||
           text.includes('ToolName\n----') ||
           text.includes('Answer in JSON using this schema') ||
           text.includes('=== AVAILABLE TOOLS ===') ||
           text.includes('=== CURRENT REQUEST ===') ||
           text.includes('=== GUIDELINES ===') ||
           text.includes('=== RESPONSE FORMAT ===') ||
           /^\s{4,}"thought":/.test(text) ||
           /^\s{4,}"action":/.test(text) ||
           /^\s{4,}"tool":/.test(text) ||
           /^\s{4,}"reasoning":/.test(text) ||
           /^\s{4,}"parameters":/.test(text) ||
           /^\s{4,}"should_continue":/.test(text) ||
           /^\s{4,}"final_response":/.test(text)
  }
  
  // Buffer for accumulating multi-line output
  let stdoutBuffer = ''
  let suppressMode = false
  
  process.stdout.write = ((
    chunk: string | Uint8Array,
    encodingOrCallback?: BufferEncoding | ((err?: Error) => void),
    callback?: (err?: Error) => void
  ): boolean => {
    const text = typeof chunk === 'string' ? chunk : chunk.toString()
    
    // Check for BAML log start
    if (/\d{4}-\d{2}-\d{2}T.*\[BAML/.test(text)) {
      suppressMode = true
      return true
    }
    
    // Check for BAML content patterns
    if (isBamlOutput(text)) {
      suppressMode = true
      return true
    }
    
    // End suppression on our own output or clear markers
    if (text.includes('╔═') || text.includes('╭─') || text.includes('❯') || 
        text.includes('⏳') || text.includes('✓') || text.includes('✗') ||
        text.includes('ℹ')) {
      suppressMode = false
    }
    
    // If in suppress mode, skip output
    if (suppressMode) {
      // Check if this line ends the BAML output block
      if (text.trim() === '' || text === '\n') {
        // Could be end of block, but stay in suppress mode
        return true
      }
      return true
    }
    
    // Normal output
    if (typeof encodingOrCallback === 'function') {
      return originalStdoutWrite(chunk, encodingOrCallback)
    }
    return originalStdoutWrite(chunk, encodingOrCallback, callback)
  }) as typeof process.stdout.write
  
  // Also filter stderr
  process.stderr.write = ((
    chunk: string | Uint8Array,
    encodingOrCallback?: BufferEncoding | ((err?: Error) => void),
    callback?: (err?: Error) => void
  ): boolean => {
    const text = typeof chunk === 'string' ? chunk : chunk.toString()
    
    if (isBamlOutput(text) || /\[BAML/.test(text)) {
      return true
    }
    
    if (typeof encodingOrCallback === 'function') {
      return originalStderrWrite(chunk, encodingOrCallback)
    }
    return originalStderrWrite(chunk, encodingOrCallback, callback)
  }) as typeof process.stderr.write
}

// ============================================================================
// NOW import the rest of the application (after filtering is set up)
// ============================================================================

import * as readline from "readline"
import * as ui from "./ui"

// Dynamic import for ShoppingAgent to ensure filtering is active first
async function loadAgent() {
  const { ShoppingAgent } = await import("./agent")
  return new ShoppingAgent()
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

class ShoppingConcierge {
  private rl: readline.Interface
  private agent: Awaited<ReturnType<typeof loadAgent>> | null = null
  private isProcessing: boolean = false

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `\n${ui.colors.brightCyan}❯${ui.colors.reset} `,
    })

    this.setupEventHandlers()
  }

  /**
   * Initialize the agent
   */
  async init(): Promise<void> {
    this.agent = await loadAgent()
  }

  /**
   * Start the application
   */
  async start(): Promise<void> {
    this.clearScreen()
    console.log(ui.welcomeBanner())
    this.rl.prompt()
  }

  /**
   * Set up readline event handlers
   */
  private setupEventHandlers(): void {
    this.rl.on("line", async (input: string) => {
      await this.handleInput(input)
    })

    this.rl.on("close", () => {
      this.shutdown()
    })

    // Handle Ctrl+C gracefully
    process.on("SIGINT", () => {
      if (this.isProcessing) {
        console.log(ui.messageBox("Cancelling current operation...", "warning"))
        this.isProcessing = false
      } else {
        this.shutdown()
      }
    })
  }

  /**
   * Handle user input
   */
  private async handleInput(input: string): Promise<void> {
    const trimmed = input.trim()

    // Skip empty input
    if (!trimmed) {
      this.rl.prompt()
      return
    }

    // Handle exit commands
    if (this.isExitCommand(trimmed)) {
      this.shutdown()
      return
    }

    // Handle clear screen
    if (trimmed.toLowerCase() === "clear" || trimmed.toLowerCase() === "cls") {
      this.clearScreen()
      console.log(ui.welcomeBanner())
      this.rl.prompt()
      return
    }

    // Process the request
    await this.processRequest(trimmed)
    this.rl.prompt()
  }

  /**
   * Process a user request with retry logic
   */
  private async processRequest(request: string): Promise<void> {
    if (this.isProcessing) {
      console.log(ui.messageBox("Please wait, processing previous request...", "warning"))
      return
    }

    if (!this.agent) {
      console.log(ui.messageBox("Agent not initialized", "error"))
      return
    }

    this.isProcessing = true
    console.log(ui.loadingMessage("Thinking"))

    let attempts = 0
    let lastError: Error | null = null

    while (attempts < CONFIG.maxRetries) {
      try {
        const response = await this.agent.run(request)
        console.log(response)
        this.isProcessing = false
        return
      } catch (error) {
        attempts++
        lastError = error instanceof Error ? error : new Error(String(error))
        
        if (attempts < CONFIG.maxRetries) {
          console.log(ui.style.warning(`  Retrying... (${attempts}/${CONFIG.maxRetries})`))
          await this.delay(CONFIG.retryDelay * attempts)
        }
      }
    }

    // All retries failed
    console.log(ui.messageBox(
      `Sorry, I encountered an error: ${lastError?.message || "Unknown error"}. Please try again.`,
      "error"
    ))
    this.isProcessing = false
  }

  /**
   * Check if input is an exit command
   */
  private isExitCommand(input: string): boolean {
    const exitCommands = ["exit", "quit", "bye", "q", ":q", ":wq"]
    return exitCommands.includes(input.toLowerCase())
  }

  /**
   * Clear the terminal screen
   */
  private clearScreen(): void {
    const write = (process.stdout as { _originalWrite?: typeof process.stdout.write })._originalWrite || process.stdout.write.bind(process.stdout)
    write.call(process.stdout, "\x1B[2J\x1B[0f")
  }

  /**
   * Shutdown the application gracefully
   */
  private shutdown(): void {
    console.log("")
    console.log(ui.divider())
    console.log("")
    console.log(`  ${ui.icons.sparkle} ${ui.style.bold("Thank you for shopping with us!")}\n`)
    console.log(`  ${ui.style.muted("Have a great day! See you next time.")}`)
    console.log("")
    console.log(ui.divider())
    console.log("")
    
    this.rl.close()
    process.exit(0)
  }

  /**
   * Helper to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ============================================================================
// STARTUP
// ============================================================================

async function main(): Promise<void> {
  // Check for required environment variables
  if (!process.env.OPENROUTER_API_KEY) {
    console.log("")
    console.log(ui.messageBox(
      "OPENROUTER_API_KEY is not set!\n\n" +
      "Please create a .env file with your API key:\n" +
      "OPENROUTER_API_KEY=your_key_here\n\n" +
      "Get your key at: https://openrouter.ai/keys",
      "error"
    ))
    process.exit(1)
  }

  // Show mode indicator in debug
  if (isDebugMode) {
    console.log(ui.style.warning(`\n⚙️  Running in DEBUG mode - BAML logs enabled\n`))
  }

  const app = new ShoppingConcierge()
  await app.init()  // Initialize agent after filtering is set up
  await app.start()
}

// Run the application
main().catch((error) => {
  console.error(ui.messageBox(`Fatal error: ${error.message}`, "error"))
  process.exit(1)
})
