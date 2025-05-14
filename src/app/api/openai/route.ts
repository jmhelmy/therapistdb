// src/app/api/openai/route.ts
import OpenAI from 'openai'

export const runtime = 'nodejs' // Force Node.js env to allow env vars

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  })

  return new Response(JSON.stringify({ result: completion.choices[0].message.content }))
}
