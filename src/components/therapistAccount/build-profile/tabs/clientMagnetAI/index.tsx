// src/components/therapistAccount/build-profile/tabs/clientMagnetAI/index.tsx
'use client';

import { useClientMagnetAI } from './useClientMagnetAI';
import ClientMagnetAIIntake from './ClientMagnetAIIntake';
import ClientMagnetAIDraft from './ClientMagnetAIDraft';
import ClientMagnetAIActions from './ClientMagnetAIActions'; // Might be integrated into Draft or be separate
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Assuming Shadcn UI
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClientMagnetAIMain() {
  const {
    isLoadingAI,
    aiError,
    currentDraft,
    selectedTone,
    setSelectedTone,
    coreValuesInput,
    setCoreValuesInput,
    generateDraft,
    applyDraftToProfile,
    clearError,
    clearDraft,
  } = useClientMagnetAI();

  const handleApplyAndNotify = () => {
    const success = applyDraftToProfile();
    if (success) {
      alert("AI suggestions have been applied to your 'Personal Statement' tab. Please review and edit them there.");
      // Optionally, clear the draft here if it's a one-time apply
      // clearDraft();
    } else {
      alert("No draft to apply. Please generate a draft first.");
    }
  };

  return (
    <div className="space-y-10 bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow-md">
      <header className="pb-4 border-b border-gray-200">
        {/* ... Header content from previous examples ... */}
        <h2 className="text-2xl font-semibold text-gray-800">AI Marketing Co-Pilot</h2>
         <p className="mt-2 text-sm text-gray-600">
          Let our AI help you craft compelling marketing text. Answer the questions below, and we'll generate a personalized draft for your profile.
        </p>
      </header>

      {aiError && (
        <Alert variant="destructive" className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>AI Generation Error</AlertTitle>
          <AlertDescription>
            {aiError}
            <Button variant="link" onClick={clearError} className="p-0 h-auto ml-2 text-xs">Dismiss</Button>
          </AlertDescription>
        </Alert>
      )}

      <ClientMagnetAIIntake
        isLoadingAI={isLoadingAI}
        onGenerateDraft={generateDraft}
        selectedTone={selectedTone}
        onToneChange={setSelectedTone}
        coreValuesInput={coreValuesInput} // Pass down if Intake form manages this local state
        onCoreValuesChange={setCoreValuesInput} // Pass down setter
      />

      {isLoadingAI && (
        <div className="text-center py-10">
          {/* ... Loader UI from previous example ... */}
           <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-600" />
           <p className="mt-3 text-md text-gray-500">Our AI is crafting your personalized suggestions...</p>
        </div>
      )}

      {!isLoadingAI && currentDraft && (
        <div className="mt-8 space-y-6">
          <ClientMagnetAIDraft
            draft={currentDraft}
            // We can pass setValue from RHF if direct editing of clientMagnetProfile.aiGeneratedMarketingCopy is needed here
          />
          <ClientMagnetAIActions
            onApplyDraft={handleApplyAndNotify}
            onRegenerate={generateDraft} // Simple regenerate for now
            isLoadingAI={isLoadingAI}
            hasDraft={!!currentDraft}
          />
        </div>
      )}
       {!isLoadingAI && !currentDraft && !aiError && (
         <div className="mt-8 text-center py-6 text-gray-500">
           <p>Complete the intake section above and click "Generate My AI Draft" to see suggestions.</p>
         </div>
       )}
    </div>
  );
}