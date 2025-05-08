// src/components/profile/PersonalStatementForm.tsx
'use client'

import React from 'react'
import { Feather } from 'lucide-react' // or import a feather icon of your choice

interface PersonalStatementFormProps {
  formData: {
    tagline: string | null
    personalStatement1: string | null
    personalStatement2: string | null
    personalStatement3: string | null
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function PersonalStatementForm({
  formData,
  handleChange,
}: PersonalStatementFormProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <Feather className="w-5 h-5" />
        <h2>Personal Statement</h2>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Tagline for service
        </label>
        <input
          name="tagline"
          value={formData.tagline ?? ''}
          onChange={handleChange}
          placeholder="e.g. Grounded, compassionate therapy for individuals..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      {/* Paragraph 1 */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Personal statement – Part 1
        </label>
        <textarea
          name="personalStatement1"
          value={formData.personalStatement1 ?? ''}
          onChange={handleChange}
          rows={5}
          placeholder="Tell your story. E.g. I’m Dr. Rivera, a licensed psychologist..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      {/* Paragraph 2 */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Personal statement – Part 2
        </label>
        <textarea
          name="personalStatement2"
          value={formData.personalStatement2 ?? ''}
          onChange={handleChange}
          rows={5}
          placeholder="What issues do you specialize in? E.g. I work with anxiety, depression..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      {/* Paragraph 3 */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Personal statement – Part 3
        </label>
        <textarea
          name="personalStatement3"
          value={formData.personalStatement3 ?? ''}
          onChange={handleChange}
          rows={5}
          placeholder="How do you work? E.g. My approach is collaborative, strengths-based..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
    </div>
  )
}
