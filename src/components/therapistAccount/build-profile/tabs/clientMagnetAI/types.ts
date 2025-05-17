// src/components/therapistAccount/build-profile/tabs/clientMagnetAI/types.ts

// Describes the structure of the data sent to the AI for generating a draft
export interface AIPromptPayload {
    clientStoryExample?: string | null;
    videoUploadIdeas?: string | null;
    coreValues?: string; // Example of a non-schema field used for prompting
    tone?: AITone;
    existingTagline?: string | null; // For refinement
    existingBody?: string | null;    // For refinement
    // You could add more context from other profile sections if needed
    // e.g., mainSpecialties?: string[];
  }
  
  // Describes the structure of the AI's response
  export interface AIResponseDraft {
    suggestedTagline?: string;
    suggestedBody?: string; // Main body content
    // Alternatively, a more structured body:
    // bodySections?: Array<{ title: string; content: string }>;
    // Any other metadata the AI might return, e.g., confidence score, reasons for suggestions
  }
  
  // Defines the available tones for AI generation
  export type AITone = 'Warm & Friendly' | 'Professional & Direct' | 'Empathetic & Gentle' | 'Inspiring & Hopeful';
  
  // State managed by the useClientMagnetAI hook
  export interface ClientMagnetAIState {
    isLoadingAI: boolean;
    aiError: string | null;
    currentDraft: AIResponseDraft | null;
    intakeValues: { // For any intake fields not directly part of the main RHF schema, or for temporary staging
      coreValuesInput: string; // Example
      // otherPromptSpecificInputs...
    };
    selectedTone: AITone;
  }
  
  // Actions for the reducer in the custom hook (if using a reducer)
  // Or just function types if not using a reducer.
  export type ClientMagnetAIAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_DRAFT'; payload: AIResponseDraft | null }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_INTAKE_VALUE'; payload: { field: keyof ClientMagnetAIState['intakeValues']; value: string } }
    | { type: 'SET_TONE'; payload: AITone };