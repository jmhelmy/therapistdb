'use client'

interface StepFooterProps {
  step: number
  back: () => void
  next: () => void
  tabs: string[]
  isSaving: boolean
}

export default function StepFooter({ step, back, next, tabs, isSaving }: StepFooterProps) {
  const isFirstStep = step <= 1
  const isLastStep = step >= tabs.length

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
        {isFirstStep ? (
          <div />
        ) : (
          <button
            type="button"
            onClick={back}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            Back
          </button>
        )}

        {!isLastStep && (
          <button
            type="submit"
            onClick={next}
            disabled={isSaving}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save & Continue'}
          </button>
        )}
      </div>
    </div>
  )
}
