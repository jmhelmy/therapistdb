// src/app/api/ai/generate-marketing-copy/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
// Assuming AIPromptPayload and AIResponseDraft are defined in a shared types file
// or you can redefine/import them. For this example, let's use the structure we discussed.
// You might want to move these to a shared location like 'src/lib/types/ai.ts'
import type { AITone } from '@/components/therapistAccount/build-profile/tabs/clientMagnetAI/types'; // Adjust path if moved

// --- Define Request Body Schema (using Zod for validation) ---
const AIPromptPayloadSchema = z.object({
  clientStoryExample: z.string().optional().nullable(),
  videoUploadIdeas: z.string().optional().nullable(),
  coreValues: z.string().optional().nullable(),
  tone: z.enum(['Warm & Friendly', 'Professional & Direct', 'Empathetic & Gentle', 'Inspiring & Hopeful']).optional(),
  // Add other fields if you send them from the frontend
  // existingTagline: z.string().optional().nullable(),
  // existingBody: z.string().optional().nullable(),
});

type AIPromptPayload = z.infer<typeof AIPromptPayloadSchema>;

interface AIResponseDraft {
  suggestedTagline?: string;
  suggestedBody?: string;
}

// --- Placeholder for your AI Service Integration ---
// Example: If using OpenAI
// import OpenAI from 'openai';
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is in .env
// });

async function getAISuggestions(payload: AIPromptPayload): Promise<AIResponseDraft> {
  // 1. Construct a detailed prompt for the AI
  let prompt = `You are an expert marketing assistant for therapists. Your goal is to help a therapist write compelling and authentic profile content that attracts their ideal clients.
The desired tone for the output is: ${payload.tone || 'Warm & Friendly'}.

Here's some information about the therapist:
`;

  if (payload.coreValues) {
    prompt += `- Core values/philosophy: ${payload.coreValues}\n`;
  }
  if (payload.clientStoryExample) {
    prompt += `- An anonymized client success story that illustrates their approach: "${payload.clientStoryExample}"\n`;
  }
  if (payload.videoUploadIdeas) {
    prompt += `- Ideas about video content: "${payload.videoUploadIdeas}"\n`;
  }
  // if (payload.existingBody) {
  //   prompt += `- Their current profile body (for refinement, if applicable): "${payload.existingBody}"\n Please refine this.`;
  // } else {
  //   prompt += `Based on the information above, please generate:
  //   1. A compelling and concise tagline (around 10-15 words).
  //   2. A profile body text (around 150-250 words) that includes sections like "My Approach to Helping" and "What Clients Can Expect".
  //   Ensure the language is authentic, empathetic, and aligns with the specified tone. Avoid overly generic statements.
  //   Focus on the therapist's unique strengths as implied by the input.`;
  // }

  prompt += `\nBased on the information above, please generate:
1. A compelling and concise tagline (around 10-20 words).
2. A profile body text (around 2-3 paragraphs, approximately 150-250 words). This body should naturally incorporate the therapist's core values and touch upon insights from their client story or video ideas if provided. It should be suitable for a therapist's professional directory profile.

Output the tagline first, then a clear separator (e.g., "---BODY---"), then the profile body text.
Example format:
Generated Tagline Text Here
---BODY---
Generated profile body text here...
`;

  console.log("Sending prompt to AI:", prompt);

  // --- !!! IMPORTANT: AI Service Integration !!! ---
  // This is where you'll use your chosen AI SDK (e.g., OpenAI, Anthropic, Google Gemini)
  // The following is a conceptual example for OpenAI:
  /*
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or "gpt-4" or your preferred model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // Adjust for creativity vs. predictability
      max_tokens: 400, // Adjust based on expected output length
    });

    const aiResponseText = completion.choices[0]?.message?.content?.trim();

    if (!aiResponseText) {
      throw new Error("AI returned an empty response.");
    }

    console.log("AI Raw Response:", aiResponseText);

    // Parse the AI response (tagline and body)
    const parts = aiResponseText.split("---BODY---");
    const suggestedTagline = parts[0]?.trim();
    const suggestedBody = parts[1]?.trim();

    if (!suggestedBody) { // Tagline might be optional, but body is crucial
        console.warn("AI response parsing might have failed to find body. Raw:", aiResponseText);
        // Fallback or more robust parsing might be needed
    }

    return {
      suggestedTagline: suggestedTagline || undefined, // Ensure undefined if empty
      suggestedBody: suggestedBody || undefined,
    };

  } catch (error) {
    console.error("Error calling AI service:", error);
    throw new Error("Failed to get suggestions from AI service.");
  }
  */

  // --- MOCK RESPONSE (Remove this when you integrate a real AI service) ---
  console.warn("Using MOCK AI response. Integrate your AI service.");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  const mockTagline = `Guiding you towards insight and growth with a ${payload.tone?.toLowerCase()} approach.`;
  const mockBody = `As a therapist dedicated to a ${payload.tone?.toLowerCase()} and collaborative process, my core belief is that ${payload.coreValues || 'every individual has the innate capacity for healing and growth'}.
Drawing from experiences where clients, much like the story involving "${payload.clientStoryExample || 'navigating complex challenges'}", have found new paths, I focus on [mention a therapeutic modality or approach, e.g., 'evidence-based techniques tailored to you'].
${payload.videoUploadIdeas ? `We can also explore how your ideas for video content, such as "${payload.videoUploadIdeas}", can further support your journey or share valuable insights.` : 'My goal is to provide a supportive space for discovery and empowerment.'}
Together, we can work towards building resilience and a more fulfilling life.`;
  return {
    suggestedTagline: mockTagline,
    suggestedBody: mockBody,
  };
  // --- END MOCK RESPONSE ---
}


export async function POST(req: Request) {
  try {
    const jsonPayload = await req.json();
    // Validate the request body
    const validatedPayload = AIPromptPayloadSchema.safeParse(jsonPayload);

    if (!validatedPayload.success) {
      return NextResponse.json({ error: "Invalid request payload", details: validatedPayload.error.format() }, { status: 400 });
    }

    const aiDraft = await getAISuggestions(validatedPayload.data);

    if (!aiDraft.suggestedBody && !aiDraft.suggestedTagline) {
        // This might happen if the AI returns nothing usable or parsing fails
        return NextResponse.json({ error: "AI failed to generate usable content." }, { status: 500 });
    }

    // Structure the response as expected by the frontend hook
    return NextResponse.json({ draft: aiDraft }, { status: 200 });

  } catch (error: any) {
    console.error("[API /ai/generate-marketing-copy] Error:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}