// src/components/build-profile/tabs/TreatmentStyleForm.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import TextareaField from '@/components/fields/TextareaField'

const OPTIONS = [
  'CBT',
  'DBT',
  'EMDR',
  'Psychodynamic',
  'Mindfulness',
  'ACT',
  'Family Systems',
  'Solution-Focused',
  'Narrative',
  'Existential',
] as const

export default function TreatmentStyleForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<{
    treatmentStyle?: string[]
    treatmentStyleDescription?: string
  }>()

  const selected = watch('treatmentStyle') || []

  const toggleStyle = (opt: string) => {
    if (selected.includes(opt)) {
      setValue(
        'treatmentStyle',
        selected.filter((s) => s !== opt),
        { shouldValidate: true }
      )
    } else if (selected.length < 3) {
      setValue(
        'treatmentStyle',
        [...selected, opt],
        { shouldValidate: true }
      )
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>🌀</span>
        <h2>Treatment Style</h2>
      </div>

      {/* Checkbox grid */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Treatments (optional, up to 3)
        </label>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleStyle(opt)}
                className="w-4 h-4 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
        {errors.treatmentStyle && (
          <p className="mt-1 text-red-600 text-sm">
            {errors.treatmentStyle.message}
          </p>
        )}
      </div>

      {/* Description */}
      <TextareaField
        label="Describe your treatment style (optional)"
        name="treatmentStyleDescription"
        rows={4}
        register={register}
        placeholder="E.g. I integrate CBT and mindfulness…"
        error={errors.treatmentStyleDescription?.message}
      />
    </div>
  )
}
