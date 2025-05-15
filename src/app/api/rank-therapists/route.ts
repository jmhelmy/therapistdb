// src/app/api/rank-therapists/route.ts
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

console.log("API_RANK_THERAPISTS: File loaded. Initializing...");
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("API_RANK_THERAPISTS: OpenAI client initialized successfully.");
  } catch (e: any) {
    console.error("API_RANK_THERAPISTS: CRITICAL - Failed to initialize OpenAI client:", e.message);
  }
} else {
  console.error("API_RANK_THERAPISTS: CRITICAL - OPENAI_API_KEY IS MISSING!");
}

interface TherapistDataFromFrontend { // Data structure sent from TherapistsPage
  id: string;
  name?: string | null;
  specialties?: string[] | null; // This is 'issues' from DB, mapped to 'specialties' for AI
  languages?: string[] | null;
  insuranceAccepted?: string | null;
  feeIndividual?: string | null;   // Passed as string
  primaryCity?: string | null;
  primaryState?: string | null;
  primaryZip?: string | null;
  treatmentStyle?: string[] | null;
  bio?: string | null;            // This is 'personalStatement1' or 'tagline' from DB
  telehealth?: boolean | null;
}

export async function POST(req: NextRequest) {
  console.log("API_RANK_THERAPISTS: Received POST request.");
  if (!openai) {
    console.error("API_RANK_THERAPISTS: OpenAI client not available.");
    return NextResponse.json({ error: 'AI service unavailable.', ranked: [] }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { issue, therapists } = body as { issue: string; therapists: TherapistDataFromFrontend[] };

    if (!issue || typeof issue !== 'string' || issue.trim() === "") { /* ... error handling ... */ }
    if (!therapists || !Array.isArray(therapists) || therapists.length === 0) { /* ... error handling ... */ }
    console.log(`API_RANK_THERAPISTS: Processing issue: "${issue}", Therapists: ${therapists.length}`);

    const listBlock = therapists.map((t: TherapistDataFromFrontend) => `
ID: ${t.id}
Name: ${t.name || 'N/A'}
Specialties: ${(t.specialties || []).join(', ') || 'Not specified'}
Languages: ${(t.languages || []).join(', ') || 'Not specified'}
Insurance Accepted: ${t.insuranceAccepted || 'N/A'}
Individual Session Fee: ${t.feeIndividual || 'N/A'}
Location: ${[t.primaryCity, t.primaryState, t.primaryZip].filter(Boolean).join(', ') || 'Not specified'}
Treatment Modalities: ${(t.treatmentStyle || []).join(', ') || 'Not specified'}
Bio Summary: ${(t.bio || '').substring(0, 300)}${(t.bio || '').length > 300 ? '...' : '' || 'No detailed bio provided.'}
Telehealth Available: ${t.telehealth ? 'Yes' : 'No/Not specified'}
    `.trim()).join('\n\n---\n');

    const prompt = `
You are an expert AI assistant specializing in mental health. Your task is to match a user with suitable therapists based on their stated issue.

User's issue: "${issue}"

Therapist Profiles:
${listBlock}

Instructions:
1. Evaluate each therapist against the user's issue, considering specialties, bio, modalities, and location context if relevant.
2. Rank therapists from most to least suitable. Provide a 'score' (integer 1-10, 10=best).
3. For each, give a concise one-sentence 'reason' (max 25 words) for their match quality.

Respond *only* with a valid JSON object containing a single key "ranked_therapists". This key's value must be an array of objects, each with "id", "score", and "reason". Example:
{
  "ranked_therapists": [
    { "id": "therapist-id-1", "score": 9, "reason": "Specializes in anxiety and uses CBT, aligning well." },
    { "id": "therapist-id-2", "score": 6, "reason": "Focus on family therapy may be less direct here." }
  ]
}
Ensure IDs match those provided.
    `.trim();

    const modelToUse = "gpt-3.5-turbo-0125"; // Or gpt-4-turbo-preview
    console.log(`API_RANK_THERAPISTS: Sending request to OpenAI (model: ${modelToUse})...`);
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: 'system', content: "You are an AI assistant providing therapist rankings in the specified JSON format: { \"ranked_therapists\": [{\"id\": ..., \"score\": ..., \"reason\": ...}] }." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.25,
      response_format: { type: "json_object" }, // Crucial for reliable JSON
    });
    // ... (rest of the API route logic: parsing, error handling, response - from previous robust version)
    // Ensure parsing expects `{"ranked_therapists": [...]}`

    const duration = Date.now() - startTime;
    console.log(`API_RANK_THERAPISTS: OpenAI request completed in ${duration}ms.`);

    const rawResponseContent = completion.choices[0].message.content;

    if (!rawResponseContent) {
      console.error("API_RANK_THERAPISTS: OpenAI returned empty or null content.");
      return NextResponse.json({ error: 'AI returned an empty response.', ranked: [] }, { status: 500 });
    }

    let parsedResponse: { ranked_therapists?: { id: string; score: number; reason: string }[] };
    let rankedOutput: { id: string; score: number; reason: string }[];

    try {
      parsedResponse = JSON.parse(rawResponseContent);
      if (parsedResponse.ranked_therapists && Array.isArray(parsedResponse.ranked_therapists)) {
        rankedOutput = parsedResponse.ranked_therapists;
        console.log(`API_RANK_THERAPISTS: Successfully parsed 'ranked_therapists' array. Found ${rankedOutput.length} items.`);
      } else {
        console.error("API_RANK_THERAPISTS: Parsed AI response missing 'ranked_therapists' array. Actual content:", JSON.stringify(parsedResponse));
        throw new Error("AI response structure incorrect: 'ranked_therapists' array not found.");
      }
    } catch (parseError: any) {
      console.error("API_RANK_THERAPISTS: Failed to parse JSON response from AI.", parseError.message);
      console.error("API_RANK_THERAPISTS: AI Raw Content that failed parsing:", rawResponseContent);
      return NextResponse.json({ error: 'AI returned data in an unexpected format.', ranked: [] }, { status: 500 });
    }

    const finalRankedResults = therapists.map(originalTherapist => {
        const aiRankedItem = rankedOutput.find((r: any) => r.id === originalTherapist.id);
        if (aiRankedItem && typeof aiRankedItem.score === 'number' && typeof aiRankedItem.reason === 'string') {
            return { id: originalTherapist.id, score: aiRankedItem.score, reason: aiRankedItem.reason };
        }
        return { id: originalTherapist.id, score: 0, reason: "Not specifically ranked by AI or data issue." };
    });

    finalRankedResults.sort((a, b) => b.score - a.score); // Sort by score

    console.log("API_RANK_THERAPISTS: Processed rankings. Sending response.");
    return NextResponse.json({ ranked: finalRankedResults });

  } catch (err: any) { // ... (Full error handling from previous robust version) ...
    console.error('API_RANK_THERAPISTS: Error in POST handler:', err.status, err.message, err.error, err.stack);
    let errorMessage = 'Unknown AI ranking error.';
    let errorStatus = 500;
    // ... (copy detailed error inspection from previous version)
    if (err.response) { /* ... */ } else if (err.status) { /* ... */ } else { /* ... */ }
    if (err.message?.toLowerCase().includes('timeout')) { errorStatus = 504; errorMessage = 'AI service timeout.'; }
    return NextResponse.json({ error: errorMessage, ranked: [] }, { status: errorStatus });
  }
}