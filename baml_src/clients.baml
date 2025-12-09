// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview

// OpenRouter clients with free models
client<llm> DeepSeekChimera {
  provider openai-generic
  options {
    base_url "https://openrouter.ai/api/v1"
    model "tngtech/deepseek-r1t2-chimera:free"
    api_key env.OPENROUTER_API_KEY
  }
}

client<llm> KatCoderPro {
  provider openai-generic
  options {
    base_url "https://openrouter.ai/api/v1"
    model "kwaipilot/kat-coder-pro:free"
    api_key env.OPENROUTER_API_KEY
  }
}

// Fallback client that tries DeepSeek first, then KatCoder
client<llm> OpenRouterFree {
  provider fallback
  options {
    strategy [DeepSeekChimera, KatCoderPro]
  }
}

// Legacy Gemini client (commented out due to rate limits)
// client<llm> Gemini {
//   provider google-ai
//   options {
//     model "gemini-2.0-flash-exp"
//     api_key env.GEMINI_API_KEY
//   }
// }

// Using the new OpenAI Responses API for enhanced formatting
client<llm> OpenAIGPT4o {
  provider openai-responses
  options {
    model "gpt-4o"
    api_key env.OPENAI_API_KEY
  }
}

client<llm> CustomSonnet4 {
  provider anthropic
  options {
    model "claude-sonnet-4-20250514"
    api_key env.ANTHROPIC_API_KEY
  }
}

// Example AWS Bedrock client (uncomment to use)
// client<llm> CustomBedrock {
//   provider aws-bedrock
//   options {
//     model "anthropic.claude-sonnet-4-20250514-v1:0"
//     region "us-east-1"
//     // AWS credentials are auto-detected from env vars
//   }
// }

// Example Azure OpenAI client (uncomment to use)
// client<llm> CustomAzure {
//   provider azure-openai
//   options {
//     model "gpt-5"
//     api_key env.AZURE_OPENAI_API_KEY
//     base_url "https://MY_RESOURCE_NAME.openai.azure.com/openai/deployments/MY_DEPLOYMENT_ID"
//     api_version "2024-10-01-preview"
//   }
// }

// Example Vertex AI client (uncomment to use)
// client<llm> CustomVertex {
//   provider vertex-ai
//   options {
//     model "gemini-2.5-pro"
//     location "us-central1"
//     // Uses Google Cloud Application Default Credentials
//   }
// }

// Example Ollama client for local models (uncomment to use)
// client<llm> CustomOllama {
//   provider openai-generic
//   options {
//     base_url "http://localhost:11434/v1"
//     model "llama4"
//     default_role "user" // Most local models prefer the user role
//     // No API key needed for local Ollama
//   }
// }