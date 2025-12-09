// Defining a data model.
class Song {
  title string
  artist string
  genre string
  lyrics string
}

// Create a function to generate a song from a string.
function GenerateSong(topic: string) -> Song {
  client OpenAIGPT4o
  prompt #"
    Generate a song about the following topic:
    {{ topic }}

    {{ ctx.output_format }}
  "#
}