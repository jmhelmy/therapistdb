// src/app/api/rank-therapists/route.ts
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; 

// --- Initial Load Logging & OpenAI Client Initialization ---
console.log("API_RANK_THERAPISTS: File loaded. Initializing...");
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("API_RANK_THERAPISTS: OpenAI client initialized successfully.");
  } catch (e: any) {
    console.error("API_RANK_THERAPISTS: CRITICAL - Failed to initialize OpenAI client:", e.message);
    openai = null; 
  }
} else {
  console.error("API_RANK_THERAPISTS: CRITICAL - OPENAI_API_KEY IS MISSING!");
}

interface TherapistDataForAI {
  id: string;
  name: string; 
  specialties?: string[] | null;
  languages?: string[] | null;
  // insuranceAccepted?: string | null;
  feeIndividual?: number | string | null; 
  city?: string | null;
  state?: string | null;
  seoZip1?: string | null; 
  treatmentStyle?: string[] | null;
  bio?: string | null;
  telehealth?: boolean | null;
}

export async function POST(req: NextRequest) {
  console.log("API_RANK_THERAPISTS: Received POST request.");

  if (!openai) { /* ... error handling ... */ }

  try {
    const body = await req.json();
    const { issue, therapists } = body as { issue: string; therapists: TherapistDataForAI[] };

    if (!issue || typeof issue !== 'string' || issue.trim() === "") { /* ... error handling ... */ }
    if (!therapists || !Array.isArray(therapists) || therapists.length === 0) { /* ... error handling ... */ }
    console.log(`API_RANK_THERAPISTS: Processing user's query: "${issue}", Number of therapists: ${therapists.length}`);

    const listBlock = therapists.map((t: TherapistDataForAI) => `
ID: ${t.id}
Name: ${t.name || 'N/A'}
Specialties: ${(t.specialties || []).join(', ') || 'Not specified'}
Languages: ${(t.languages || []).join(', ') || 'Not specified'}
Insurance Accepted: ${t.insuranceAccepted || 'N/A'}
Individual Session Fee: ${t.feeIndividual ? (typeof t.feeIndividual === 'number' ? `$${t.feeIndividual}` : t.feeIndividual) : 'N/A'}
Location: ${[t.city, t.state, t.seoZip1].filter(Boolean).join(', ') || 'Not specified'}
Treatment Modalities: ${(t.treatmentStyle || []).join(', ') || 'Not specified'}
Telehealth Available: ${t.telehealth === true ? 'Yes' : t.telehealth === false ? 'No' : 'Not specified'}
Bio Summary: ${(t.bio || '').substring(0, 300)}${(t.bio || '').length > 300 ? '...' : '' || 'No bio provided.'} 
    `.trim()).join('\n\n---\n');

    // <<< USING THE ENHANCED PROMPT >>>
    const prompt = `
You are an expert AI assistant specializing in mental health. Your task is to match a user with the most suitable therapists based on their stated issue by deeply understanding the user's needs and the nuances of each therapist's full profile.

User's issue (this is their direct input): "${issue}"

Below are profiles of available therapists. Please:
1. Carefully evaluate each therapist's *entire profile* (including their bio, specialties, treatment modalities, languages, etc.) against the user's full issue statement. Go beyond simple keyword matching. Try to infer the underlying needs and preferences from the user's statement and see how well the therapist's approach, experience, and style align.
2. Rank the therapists from the most suitable to the least suitable for this specific user query. Provide a score from 1 (least suitable) to 10 (most suitable).
3. For each therapist, provide a concise, insightful, one-sentence reason (maximum 25 words) explaining why they are a good or less suitable match, focusing on the alignment with the user's *full query*.

Therapist Profiles:
${listBlock}

Respond *only* with a valid JSON object containing a single key "ranked_therapists".
This key's value must be an array of objects, each with "id", "score", and "reason".
Example of desired JSON output:
{
  "ranked_therapists": [
    { "id": "therapist-id-1", "score": 9, "reason": "Their holistic approach described in the bio and CBT specialty seem well-suited for the user's stated feelings." },
    { "id": "therapist-id-2", "score": 6, "reason": "While experienced, their primary focus on adolescent therapy may be less direct for this adult's query." }
  ]
}

Do not include any introductory text, concluding remarks, or any characters outside the main JSON object.
The therapist IDs in your response must exactly match the IDs provided in the profiles. Ensure scores are integers between 1 and 10.
    `.trim();

    const modelToUse = "gpt-3.5-turbo-0125"; 
    console.log(`API_RANK_THERAPISTS: Sending request to OpenAI (model: ${modelToUse})...`);
    
    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: 'system', content: "You are an AI assistant that provides therapist rankings in a JSON object format: { \"ranked_therapists\": [{\"id\": ..., \"score\": ..., \"reason\": ...}] }." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // Using the slightly higher temp
      response_format: { type: "json_object" }, 
    });

    const rawResponseContent = completion.choices[0].message.content;
    if (!rawResponseContent) { /* ... error handling ... */ }

    let parsedResponse: { ranked_therapists?: { id: string; score: number; reason: string }[] };
    let rankedOutput: { id: string; score: number; reason: string }[];
    try {
      parsedResponse = JSON.parse(rawResponseContent);
      if (parsedResponse.ranked_therapists && Array.isArray(parsedResponse.ranked_therapists)) {
        rankedOutput = parsedResponse.ranked_therapists;
      } else { /* ... fallback parsing ... */ }
    } catch (parseError: any) { /* ... error handling ... */ }
    
    const finalRankedResults = therapists.map(originalTherapist => {
        const aiRankedItem = rankedOutput.find((r: any) => r.id === originalTherapist.id);
        if (aiRankedItem && typeof aiRankedItem.score === 'number' && typeof aiRankedItem.reason === 'string') {
            return { id: originalTherapist.id, score: aiRankedItem.score, reason: aiRankedItem.reason };
        }
        // Using your default reason wording
        return { id: originalTherapist.id, score: 0, reason: "This therapist was not specifically ranked by the AI for this issue or data was incomplete." };
    });

    // <<< USING YOUR MORE ROBUST SORT LOGIC (WITH TIE-BREAKING) >>>
    finalRankedResults.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        const indexA = therapists.findIndex(t => t.id === a.id);
        const indexB = therapists.findIndex(t => t.id === b.id);
        return indexA - indexB; 
    });

    return NextResponse.json({ ranked: finalRankedResults });

  } catch (err: any) { /* ... your existing detailed error handling ... */ }
}