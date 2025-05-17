// src/components/therapistAccount/build-profile/tabs/clientMagnetAI/ClientMagnetAIActions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Edit3, RotateCcw, Loader2 } from 'lucide-react';

interface ClientMagnetAIActionsProps {
  onApplyDraft: () => void;
  onRegenerate: () => void; // Add more specific refine handlers later if needed
  isLoadingAI: boolean;
  hasDraft: boolean;
}

export default function ClientMagnetAIActions({
  onApplyDraft,
  onRegenerate,
  isLoadingAI,
  hasDraft,
}: ClientMagnetAIActionsProps) {
  return (
    <section className="pt-6 border-t border-gray-200 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div>
        <Button
          onClick={onApplyDraft}
          disabled={isLoadingAI || !hasDraft}
          size="lg"
          className="w-full sm:w-auto"
        >
          <Edit3 className="mr-2 h-5 w-5" />
          Apply Draft to My Personal Statement & Edit
        </Button>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed sm:max-w-md">
          This copies the suggestions to the 'Personal Statement' tab for your final review.
          Your intake answers and this AI draft (including your edits above) will also be saved.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onRegenerate}
        disabled={isLoadingAI}
        className="w-full mt-3 sm:mt-0 sm:w-auto"
      >
        {isLoadingAI && !hasDraft ? ( // Check if loading for initial draft
             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loader if this button also triggers generation
        ) : (
             <RotateCcw className="mr-2 h-4 w-4" />
        )}
        {hasDraft ? 'Regenerate Suggestions' : 'Generate Initial Suggestions'}
      </Button>
    </section>
  );
}