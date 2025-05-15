// src/app/api/rank-therapists/route.ts
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Explicitly setting Node.js runtime

// --- Initial Load Logging & OpenAI Client Initialization ---
console.log("API_RANK_THERAPISTS: File loaded. Initializing...");

let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("API_RANK_THERAPISTS: OpenAI client initialized successfully.");
  } catch (e: any) {
    console.error("API_RANK_THERAPISTS: CRITICAL - Failed to initialize OpenAI client with API key:", e.message);
    openai = null; // Ensure it's null if initialization fails
  }
} else {
  console.error("API_RANK_THERAPISTS: CRITICAL - OPENAI_API_KEY IS MISSING FROM ENV! OpenAI functionality will be disabled.");
}
// --- End Initial Load Logging ---


// Define a more specific type for therapist input data if possible
interface TherapistDataForAI {
  id: string;
  name: string;
  specialties?: string[];
  languages?: string[];
  insuranceAccepted?: string | null;
  feeIndividual?: number | null;
  city?: string | null;
  state?: string | null;
  seoZip1?: string | null;
  treatmentStyle?: string[];
  bio?: string | null;
  // Add any other fields passed from the frontend and used in the prompt
}

export async function POST(req: NextRequest) {
  console.log("API_RANK_THERAPISTS: Received POST request.");

  if (!openai) {
    console.error("API_RANK_THERAPISTS: OpenAI client not available (API key likely missing or initialization failed).");
    return NextResponse.json(
      { error: 'AI service is currently unavailable due to a server configuration issue.', ranked: [] },
      { status: 503 } // Service Unavailable
    );
  }

  try {
    const body = await req.json();
    const { issue, therapists } = body as { issue: string; therapists: TherapistDataForAI[] };

    if (!issue || typeof issue !== 'string' || issue.trim() === "") {
      console.warn("API_RANK_THERAPISTS: Invalid request - issue is missing or empty.");
      return NextResponse.json({ error: 'A specific issue is required for ranking.', ranked: [] }, { status: 400 });
    }
    if (!therapists || !Array.isArray(therapists) || therapists.length === 0) {
      console.warn("API_RANK_THERAPISTS: Invalid request - therapists array is missing or empty.");
      return NextResponse.json({ error: 'A list of therapists is required for ranking.', ranked: [] }, { status: 400 });
    }
    console.log(`API_RANK_THERAPISTS: Processing issue: "${issue}", Number of therapists: ${therapists.length}`);

    // Constructing the detailed list block for the prompt
    const listBlock = therapists.map((t: TherapistDataForAI) => `
ID: ${t.id}
Name: ${t.name || 'N/A'}
Specialties: ${(t.specialties || []).join(', ') || 'Not specified'}
Languages: ${(t.languages || []).join(', ') || 'Not specified'}
Insurance Accepted: ${t.insuranceAccepted || 'N/A'}
Individual Session Fee: ${t.feeIndividual ? `$${t.feeIndividual}` : 'N/A'}
Location: ${[t.city, t.state, t.seoZip1].filter(Boolean).join(', ') || 'Not specified'}
Treatment Modalities: ${(t.treatmentStyle || []).join(', ') || 'Not specified'}
Bio Summary: ${(t.bio || '').substring(0, 250)}${(t.bio || '').length > 250 ? '...' : '' || 'No bio provided.'}
    `.trim()).join('\n\n---\n'); // Using --- as a clearer separator for the LLM

    const prompt = `
You are an expert AI assistant specializing in mental health. Your task is to match a user with the most suitable therapists based on their stated issue.

User's issue: "${issue}"

Below are profiles of available therapists. Please:
1. Carefully evaluate each therapist's profile against the user's issue. Consider their specialties, modalities, bio, and any other relevant information.
2. Rank the therapists from the most suitable to the least suitable for this specific issue. Provide a score from 1 (least suitable) to 10 (most suitable).
3. For each therapist, provide a concise, insightful, one-sentence reason (maximum 25 words) explaining why they are a good or less suitable match. Focus on direct relevance to the user's issue.

Therapist Profiles:
${listBlock}

Respond *only* with a valid JSON array of objects. Each object in the array must represent a therapist and strictly follow this structure:
{
  "id": "therapist-id-string",
  "score": ranking_score_integer,
  "reason": "Concise one-sentence explanation for the ranking, based on the user's issue."
}

Example of desired JSON output:
[
  { "id": "therapist-id-1", "score": 9, "reason": "Specializes in anxiety and uses CBT, aligning well with the user's needs." },
  { "id": "therapist-id-2", "score": 6, "reason": "Experienced, but primary focus on family therapy may be less direct for this individual issue." }
]

Do not include any introductory text, concluding remarks, or any characters outside the main JSON array. The therapist IDs in your response must exactly match the IDs provided in the profiles. Ensure scores are integers between 1 and 10.
    `.trim();

    // console.log("API_RANK_THERAPISTS: Generated prompt:", prompt); // Uncomment for deep prompt debugging. VERY VERBOSE.

    // Recommended model: gpt-3.5-turbo-0125 or gpt-4-turbo-preview for JSON mode and balance.
    // gpt-4 is powerful but slower and more expensive.
    const modelToUse = "gpt-3.5-turbo-0125"; // Or "gpt-4-turbo-preview" or "gpt-4"
    console.log(`API_RANK_THERAPISTS: Sending request to OpenAI (model: ${modelToUse})...`);
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: 'system', content: "You are an AI assistant that provides therapist rankings in a perfect JSON array format as instructed, with 'id', 'score', and 'reason' fields for each therapist." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2, // Lower temperature for more deterministic and factual output
      // For models that support it (gpt-3.5-turbo-0125, gpt-4-turbo-preview, etc.):
      response_format: { type: "json_object" },
    });

    const duration = Date.now() - startTime;
    console.log(`API_RANK_THERAPISTS: OpenAI request completed in ${duration}ms.`);

    const rawResponseContent = completion.choices[0].message.content;

    if (!rawResponseContent) {
      console.error("API_RANK_THERAPISTS: OpenAI returned empty or null content.");
      return NextResponse.json({ error: 'AI returned an empty response.', ranked: [] }, { status: 500 });
    }
    // console.log("API_RANK_THERAPISTS: Raw AI response content:", rawResponseContent); // Log for debugging parsing

    let parsedResponse: { ranked_therapists?: { id: string; score: number; reason: string }[] } | { id: string; score: number; reason: string }[];
    let rankedOutput: { id: string; score: number; reason: string }[];

    try {
      parsedResponse = JSON.parse(rawResponseContent);

      // Handle if AI wraps the array in a key (common with response_format: "json_object")
      if (typeof parsedResponse === 'object' && !Array.isArray(parsedResponse) && (parsedResponse as any).ranked_therapists && Array.isArray((parsedResponse as any).ranked_therapists)) {
        rankedOutput = (parsedResponse as any).ranked_therapists;
        console.log("API_RANK_THERAPISTS: Extracted 'ranked_therapists' array from AI JSON object.");
      } else if (Array.isArray(parsedResponse)) {
        rankedOutput = parsedResponse;
        console.log("API_RANK_THERAPISTS: AI response was directly a JSON array.");
      } else {
         // Try to find an array if it's nested under some other arbitrary key (less ideal)
         const keyWithArray = Object.keys(parsedResponse).find(k => Array.isArray((parsedResponse as any)[k]));
         if (keyWithArray) {
            rankedOutput = (parsedResponse as any)[keyWithArray];
            console.warn(`API_RANK_THERAPISTS: Found ranked array under unexpected key '${keyWithArray}'. Consider refining prompt for 'ranked_therapists' key.`);
         } else {
            console.error("API_RANK_THERAPISTS: Parsed AI response is not an array and 'ranked_therapists' key not found. Actual content:", JSON.stringify(parsedResponse));
            throw new Error("AI response was not a JSON array or structured as expected (e.g., { ranked_therapists: [...] }).");
         }
      }
      console.log(`API_RANK_THERAPISTS: Successfully parsed AI response. Found ${rankedOutput.length} ranked items.`);

    } catch (parseError: any) {
      console.error("API_RANK_THERAPISTS: Failed to parse JSON response from AI.", parseError.message);
      console.error("API_RANK_THERAPISTS: AI Raw Content that failed parsing:", rawResponseContent);
      return NextResponse.json({ error: 'AI returned data in an unexpected format.', ranked: [] }, { status: 500 });
    }

    // Validate and merge with original therapists to ensure all are present and sorted by score
    const finalRankedResults = therapists.map(originalTherapist => {
        const aiRankedItem = rankedOutput.find((r: any) => r.id === originalTherapist.id);
        if (aiRankedItem && typeof aiRankedItem.score === 'number' && typeof aiRankedItem.reason === 'string') {
            return { id: originalTherapist.id, score: aiRankedItem.score, reason: aiRankedItem.reason };
        }
        console.warn(`API_RANK_THERAPISTS: AI data for therapist ID ${originalTherapist.id} was missing, malformed, or AI did not rank it. Adding with default reason/score.`);
        return { id: originalTherapist.id, score: 0, reason: "This therapist was not specifically ranked by the AI for this issue or data was incomplete." };
    });

    // Sort by score (descending), then by original order as a tie-breaker
    finalRankedResults.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        const indexA = therapists.findIndex(t => t.id === a.id);
        const indexB = therapists.findIndex(t => t.id === b.id);
        return indexA - indexB;
    });

    console.log("API_RANK_THERAPISTS: Successfully processed and sorted rankings. Sending response.");
    return NextResponse.json({ ranked: finalRankedResults });

  } catch (err: any) {
    console.error('API_RANK_THERAPISTS: An error occurred in the POST handler.');
    let errorMessage = 'An unknown error occurred while processing the AI ranking.';
    let errorStatus = 500;

    if (err.response) {
      console.error('🔥 OpenAI API Error (err.response): Status:', err.response.status, 'Data:', err.response.data);
      errorMessage = err.response.data?.error?.message || `OpenAI API Error: ${err.response.status}`;
      errorStatus = err.response.status || 500;
    } else if (err.status) { // Error structure from newer OpenAI SDK (v4+)
        console.error('🔥 OpenAI SDK Error: Status:', err.status, 'Message:', err.message, 'Details:', JSON.stringify(err.error));
        errorMessage = (err.error as any)?.message || err.message;
        errorStatus = err.status || 500;
    } else {
      console.error('🔥 Non-OpenAI or Unknown Error:', err.message, err.stack);
      errorMessage = err.message;
    }

    if (err.message && (err.message.toLowerCase().includes('timeout') || err.code === 'ETIMEDOUT')) {
        errorMessage = 'The request to the AI service timed out. Please try again shortly.';
        errorStatus = 504; // Gateway Timeout
        console.error("API_RANK_THERAPISTS: Request timed out.");
    }

    return NextResponse.json({ error: `Failed to get AI ranking: ${errorMessage}`, ranked: [] }, { status: errorStatus });
  }
}