'use client'

import React from 'react'

interface TreatmentStyleFormProps {
  formData: {
    treatmentIssues: string[]
    topTreatmentIssues: string[]
    treatmentStyleDescription: string
  }
  handleCheckboxChange: (field: string, value: string) => void
  handleStarredChange: (value: string) => void
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const TreatmentStyleForm = ({
  formData,
  handleCheckboxChange,
  handleStarredChange,
  handleChange,
}: TreatmentStyleFormProps) => {
  const maxStars = 3

  const toggleStar = (item: string) => {
    const isSelected = formData.topTreatmentIssues?.includes(item)
    if (isSelected) {
      handleStarredChange(item)
    } else if ((formData.topTreatmentIssues || []).length < maxStars) {
      handleStarredChange(item)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">🧩 Treatment Style</h2>

      <div>
        <p className="text-sm font-semibold mb-2">
          Issues <span className="text-gray-500">(click to star top 3)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {formData.treatmentIssues?.map((issue) => (
            <label key={issue} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(formData.treatmentIssues || []).includes(issue)}
                onChange={() => handleCheckboxChange('treatmentIssues', issue)}
              />
              <span
                className={`text-sm cursor-pointer ${
                  (formData.topTreatmentIssues || []).includes(issue)
                    ? 'text-yellow-500 font-semibold'
                    : ''
                }`}
                onClick={() => toggleStar(issue)}
              >
                {issue}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Describe your specialty and client focus
        </label>
        <textarea
          name="treatmentStyleDescription"
          value={formData.treatmentStyleDescription || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        />
      </div>
    </div>
  )
}

export default TreatmentStyleForm
