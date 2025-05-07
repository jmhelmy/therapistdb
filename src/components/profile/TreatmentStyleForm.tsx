// ✅ TreatmentStyleForm.tsx
'use client'

import React from 'react'

export default function TreatmentStyleForm({ formData, handleChange, handleCheckboxChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">🧠 Treatment Style</h2>
      {/* Example content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Types of Therapy (comma-separated)
        </label>
        <input
          type="text"
          name="typesOfTherapy"
          value={formData.typesOfTherapy.join(', ')}
          onChange={e =>
            handleChange({
              target: {
                name: 'typesOfTherapy',
                value: e.target.value.split(',').map(v => v.trim()),
              },
            })
          }
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        />
      </div>
    </div>
  )
}
