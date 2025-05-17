// src/components/therapistAccount/build-profile/tabs/clientMagnetAI/constants.ts
import type { AITone } from './types';

export const AI_TONE_OPTIONS: Array<{ value: AITone; label: string }> = [
  { value: 'Warm & Friendly', label: 'Warm & Friendly' },
  { value: 'Professional & Direct', label: 'Professional & Direct' },
  { value: 'Empathetic & Gentle', label: 'Empathetic & Gentle' },
  { value: 'Inspiring & Hopeful', label: 'Inspiring & Hopeful' },
];

export const DEFAULT_AI_TONE: AITone = 'Warm & Friendly';

export const INTAKE_FIELD_PROPS = {
  clientStoryExample: {
    label: "Client Success Story (Anonymous)",
    placeholder: "Describe a transformative client journey, focusing on your approach and the positive outcome (e.g., 'Helped a client navigate career anxiety by... resulting in...'). Keep it anonymous.",
    helperText: "This helps the AI understand the impact of your work. Optional, but highly recommended.",
    rhfName: "clientMagnetProfile.clientStoryExample" as const, // For react-hook-form
  },
  videoUploadIdeas: {
    label: "Video Presence & Ideas",
    placeholder: "e.g., 'I have an intro video on my site,' or 'Thinking about a video on coping skills.'",
    helperText: "Mentioning this can help the AI subtly weave in your broader presence. Optional.",
    rhfName: "clientMagnetProfile.videoUploadIdeas" as const, // For react-hook-form
  },
  // Example for a non-schema field, managed by local state in the hook
  coreValuesInput: {
      label: "Core Values/Philosophies",
      placeholder: "e.g., 'Empowerment through self-discovery,' or 'The healing power of a safe, non-judgmental space.'",
      helperText: "What are 1-2 principles central to your therapy work? This directly informs the AI.",
  }
};