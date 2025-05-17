// src/components/therapistAccount/build-profile/tabs/clientMagnetAI/ClientMagnetAIIntake.tsx
'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { FullTherapistProfile } from '@/lib/schemas/therapistSchema';
import { Button } from '@/components/ui/button';
import { Info, Wand2, Loader2 } from 'lucide-react';
import { AI_TONE_OPTIONS, INTAKE_FIELD_PROPS } from './constants';
import type { AITone } from './types';
import { useState } from 'react';

interface ClientMagnetAIIntakeProps {
  isLoadingAI: boolean;
  onGenerateDraft: () => void;
  selectedTone: AITone;
  onToneChange: (tone: AITone) => void;
  coreValuesInput: string;
  onCoreValuesChange: (value: string) => void;
}

export default function ClientMagnetAIIntake({
  isLoadingAI,
  onGenerateDraft,
  selectedTone,
  onToneChange,
  coreValuesInput,
  onCoreValuesChange,
}: ClientMagnetAIIntakeProps) {
  const { control, formState: { errors } } = useFormContext<FullTherapistProfile>();
  const [showIntakeInfo, setShowIntakeInfo] = useState(false);
  const figmaInputClassName = "bg-gray-100 border-gray-300 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500 text-sm rounded-md shadow-sm w-full py-2 px-3"; // Consistent styling

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-700">Step 1: Share Your Insights</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowIntakeInfo(!showIntakeInfo)} className="text-teal-600 hover:text-teal-700">
          <Info size={16} className="mr-1.5" /> Why these questions?
        </Button>
      </div>
      {showIntakeInfo && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-md text-sm text-sky-700 space-y-1">
            <p>Your answers help the AI understand your unique approach, the clients you best serve, and your professional voice. The more specific and authentic your input, the better the AI suggestions will be!</p>
        </div>
      )}

      {/* Client Success Story - RHF Controlled */}
      <div>
        <label htmlFor={INTAKE_FIELD_PROPS.clientStoryExample.rhfName} className="block text-sm font-medium text-gray-700 mb-1.5">
          {INTAKE_FIELD_PROPS.clientStoryExample.label}
          <span className="text-gray-400 text-xs ml-1">(Optional, but highly recommended)</span>
        </label>
        <Controller
          name={INTAKE_FIELD_PROPS.clientStoryExample.rhfName}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id={INTAKE_FIELD_PROPS.clientStoryExample.rhfName}
              rows={4}
              className={figmaInputClassName}
              placeholder={INTAKE_FIELD_PROPS.clientStoryExample.placeholder}
            />
          )}
        />
        {errors.clientMagnetProfile?.clientStoryExample && (
          <p className="mt-1 text-xs text-red-500">{(errors.clientMagnetProfile.clientStoryExample as any)?.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{INTAKE_FIELD_PROPS.clientStoryExample.helperText}</p>
      </div>

      {/* Core Values - Locally Controlled via prop from hook, for AI prompt only */}
      <div>
        <label htmlFor="coreValuesInput" className="block text-sm font-medium text-gray-700 mb-1.5">
            {INTAKE_FIELD_PROPS.coreValuesInput.label}
        </label>
        <textarea
            id="coreValuesInput"
            name="coreValuesInput"
            rows={3}
            value={coreValuesInput}
            onChange={(e) => onCoreValuesChange(e.target.value)}
            className={figmaInputClassName}
            placeholder={INTAKE_FIELD_PROPS.coreValuesInput.placeholder}
        />
        <p className="mt-1 text-xs text-gray-500">{INTAKE_FIELD_PROPS.coreValuesInput.helperText}</p>
      </div>


      {/* Video Ideas - RHF Controlled */}
      <div>
        <label htmlFor={INTAKE_FIELD_PROPS.videoUploadIdeas.rhfName} className="block text-sm font-medium text-gray-700 mb-1.5">
            {INTAKE_FIELD_PROPS.videoUploadIdeas.label}
             <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </label>
        <Controller
          name={INTAKE_FIELD_PROPS.videoUploadIdeas.rhfName}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id={INTAKE_FIELD_PROPS.videoUploadIdeas.rhfName}
              rows={3}
              className={figmaInputClassName}
              placeholder={INTAKE_FIELD_PROPS.videoUploadIdeas.placeholder}
            />
          )}
        />
        {errors.clientMagnetProfile?.videoUploadIdeas && (
          <p className="mt-1 text-xs text-red-500">{(errors.clientMagnetProfile.videoUploadIdeas as any)?.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{INTAKE_FIELD_PROPS.videoUploadIdeas.helperText}</p>
      </div>

      {/* Tone Selector */}
      <div>
        <label htmlFor="aiPromptTone" className="block text-sm font-medium text-gray-700 mb-1.5">Desired Tone for AI Suggestions</label>
        <select
          id="aiPromptTone"
          name="aiPromptTone"
          value={selectedTone}
          onChange={(e) => onToneChange(e.target.value as AITone)}
          className={`${figmaInputClassName} w-full sm:w-1/2`}
        >
          {AI_TONE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <Button onClick={onGenerateDraft} disabled={isLoadingAI} size="lg" className="w-full sm:w-auto">
          {isLoadingAI ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Generate My AI Draft
        </Button>
      </div>
    </section>
  );
}