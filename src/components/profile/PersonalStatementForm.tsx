'use client'

import React from 'react'

interface Props {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function SpecialtiesForm({ formData, handleChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Specialties and Client Focus</h2>

      {/* Issues */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Issues</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['Alcoholism', 'Anxiety', 'Depression'].map((issue) => (
            <label key={issue} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="clientConcerns"
                value={issue}
                checked={formData.clientConcerns.includes(issue)}
                onChange={handleChange}
              />
              <span>{issue}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Describe your specialty and client focus</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          rows={4}
        />
      </div>

      {/* Ages */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ages</label>
        <div className="flex flex-wrap gap-2">
          {['Children', 'Teens', 'Adults', 'Elders (65+)'].map((age) => (
            <label key={age} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="ages"
                value={age}
                checked={formData.ages.includes(age)}
                onChange={handleChange}
              />
              <span>{age}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
        <div className="flex gap-4">
          {['English', 'Spanish'].map((lang) => (
            <label key={lang} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="languages"
                value={lang}
                checked={formData.languages.includes(lang)}
                onChange={handleChange}
              />
              <span>{lang}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
