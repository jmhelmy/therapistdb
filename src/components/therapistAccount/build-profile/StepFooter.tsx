'use client'

interface StepFooterProps {
  step: number
  back: () => void
  next: () => void // Assuming 'next' also handles the submit action or is tied to type="submit"
  tabs: string[] // Represents the total number of steps/tabs
  isSaving: boolean
}

export default function StepFooter({ step, back, next, tabs, isSaving }: StepFooterProps) {
  const isFirstStep = step <= 1
  // Ensure isLastStep correctly identifies the final actionable step.
  // If 'Save & Continue' should become 'Finish' or 'Submit' on the last step,
  // the logic for button text and action might need to change.
  // For this refactor, we'll assume 'Save & Continue' is hidden on the actual last step.
  const isEffectivelyLastStepForNextButton = step >= tabs.length // No "Save & Continue" if current step is the last one
  const isPenultimateStep = step === tabs.length - 1 // The step *before* the last, where "Save & Continue" might still be relevant

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md print:hidden">
      {/* Added print:hidden to hide footer during printing */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Back Button */}
        {isFirstStep ? (
          <div /> // Placeholder to maintain layout when "Back" is not shown
        ) : (
          <button
            type="button"
            onClick={back}
            disabled={isSaving} // Disable back button too if saving, to prevent navigation issues
            className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Back
          </button>
        )}

        {/* Next/Submit Button */}
        {/* This logic assumes 'next' is the primary action for proceeding.
            If the last step needs a different button like "Finish", you'd add more logic here.
            For example, if step === tabs.length is the final confirmation step.
        */}
        {!isEffectivelyLastStepForNextButton && (
          <button
            type="button" // Changed to "button" as onClick is provided. If it's a real form submit, keep "submit"
            onClick={next} // This function should handle form validation and submission if type="button"
            disabled={isSaving}
            className="px-4 py-2 bg-teal-600 text-sm font-medium text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving…' : 'Save & Continue'}
          </button>
        )}
         {/* Example: If you need a "Finish" button on the very last step */}
         {step === tabs.length && ( /* Assuming tabs.length is the final step that needs a different action */
          <button
            type="submit" // Or type="button" if onClick handles final submission
            onClick={next} // Or a different final submission handler
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-sm font-medium text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Submitting…' : 'Finish & Submit'}
          </button>
        )}
      </div>
    </div>
  )
}