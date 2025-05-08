// src/components/profile/TreatmentStyleForm.tsx
'use client'

import React from 'react'
import { Layers } from 'lucide-react'

interface TreatmentStyleFormProps {
  formData: {
    treatmentStyle: string[] | null
    treatmentStyleDescription: string | null
  }
  handleCheckboxChange: (value: string) => void
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

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
  // …add or remove options as needed
]

export default function TreatmentStyleForm({
  formData,
  handleCheckboxChange,
  handleChange,
}: TreatmentStyleFormProps) {
  // ensure array is never null
  const selected = formData.treatmentStyle ?? []

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <Layers className="w-5 h-5" />
        <h2>Treatment Style</h2>
      </div>

      {/* Checkbox grid */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Treatments
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Select up to 3 treatment approaches you use most often.
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
                className="w-4 h-4 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Describe your treatment style
        </label>
        <textarea
          name="treatmentStyleDescription"
          value={formData.treatmentStyleDescription ?? ''}
          onChange={handleChange}
          rows={4}
          placeholder="E.g. I integrate CBT and mindfulness to help clients build skills…"
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
    </div>
  )
}
