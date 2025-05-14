// src/app/api/rank-therapists/route.ts
import OpenAI from 'openai'

export const runtime = 'nodejs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { issue, therapists } = await req.json()

  const listBlock = therapists.map((t: any) => `
ID: ${t.id}
Name: ${t.name}
Specialties: ${(t.issues || []).join(', ')}
Languages: ${(t.languages || []).join(', ')}
Insurance: ${t.insuranceAccepted || 'N/A'}
Fees: ${t.feeIndividual || 'N/A'}
Location: ${[t.primaryCity, t.primaryState, t.primaryZip].filter(Boolean).join(', ')}
Modalities: ${(t.treatmentStyle || []).join(', ')}
  `.trim()).join('\n\n')

  const prompt = `
You are an assistant matching a user with a therapist based on this user issue:
"${issue}"

Below are full profiles of the candidate therapists. Rank them from best fit to least, and for each therapist give a one-sentence reason why they’re a good (or poor) match.

${listBlock}

Respond only with a JSON array of objects like:
[
  { "id": "therapist-id-1", "reason": "They specialize in X and offer sliding-scale." },
  { "id": "therapist-id-2", "reason": "…" }
]
`.trim()

  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  })

  try {
    const ranked = JSON.parse(res.choices[0].message.content || '[]')
    return new Response(JSON.stringify({ ranked }), { status: 200 })
  } catch (err) {
    console.error('Could not parse OpenAI response:', res.choices[0].message.content)
    return new Response(JSON.stringify({ error: 'Failed to parse OpenAI response' }), { status: 500 })
  }
}
