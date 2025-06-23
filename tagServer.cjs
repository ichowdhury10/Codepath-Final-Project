/* tag.server.cjs */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Configuration, OpenAIApi } = require('openai')

// Ensure we have an API key
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: Missing OPENAI_API_KEY in .env')
  process.exit(1)
}

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const app = express()
app.use(cors())
app.use(express.json())

// ─── Tag suggestions endpoint ───────────────────────────────────────
app.post('/tag', async (req, res) => {
  const { content } = req.body
  if (!content) {
    return res.status(400).json({ error: 'Missing content' })
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Suggest 4–5 short, single-word tags (comma-separated) for this forum post content:\n\n"""${content}"""\n\nTags:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 30,
    })

    const tagsText = completion.data.choices[0].message.content.trim()
    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    res.json({ tags })
  } catch (err) {
    console.error('OpenAI /tag error:', err)
    res.status(500).json({ error: 'OpenAI request failed' })
  }
})

// ─── Summarization endpoint ─────────────────────────────────────────
app.post('/summarize', async (req, res) => {
  const { content } = req.body
  if (!content) {
    return res.status(400).json({ error: 'Missing content' })
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `"""${content}"""\n\nIn one short sentence, summarize the key point of the above post.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    })

    const summary = completion.data.choices[0].message.content.trim()
    res.json({ summary })
  } catch (err) {
    console.error('OpenAI /summarize error:', err)
    res.status(500).json({ error: 'OpenAI request failed' })
  }
})

// ─── Start server ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Tag server listening on http://localhost:${PORT}`)
})
