'use client'

import React from 'react'

interface SpecialtiesFormProps {
  formData: {
    clientConcerns: string[]
    topConcerns: string[]
    specialtyDescription: string
    mentalHealth: string[]
    sexuality: string[]
    ages: string[]
    participants: string[]
    communities: string[]
    faith: string[]
    languages: string[]
  }
  handleCheckboxChange: (field: string, value: string) => void
  handleStarredChange: (value: string) => void
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const CheckboxGroup = ({
  label,
  items,
  field,
  selected = [],
  onChange,
}: {
  label: string
  items: string[]
  field: string
  selected?: string[] // Mark as optional to prevent undefined errors
  onChange: (field: string, value: string) => void
}) => (
  <div>
    <p className="text-sm font-semibold mb-2">{label}</p>
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <label key={item} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={(selected || []).includes(item)} // Defensive fallback
            onChange={() => onChange(field, item)}
          />
          <span className="text-sm">{item}</span>
        </label>
      ))}
    </div>
  </div>
)

const SpecialtiesForm = ({
  formData,
  handleCheckboxChange,
  handleStarredChange,
  handleChange,
}: SpecialtiesFormProps) => {
  const maxStars = 3

  const toggleStar = (item: string) => {
    const isSelected = formData.topConcerns?.includes(item)
    if (isSelected) {
      handleStarredChange(item)
    } else if ((formData.topConcerns || []).length < maxStars) {
      handleStarredChange(item)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">🧠 Specialties and Client Focus</h2>

      <div>
        <p className="text-sm font-semibold mb-2">
          Issues <span className="text-gray-500">(click to star top 3)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {formData.clientConcerns?.map((issue) => (
            <label key={issue} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(formData.clientConcerns || []).includes(issue)}
                onChange={() => handleCheckboxChange('clientConcerns', issue)}
              />
              <span
                className={`text-sm cursor-pointer ${
                  (formData.topConcerns || []).includes(issue)
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
          name="specialtyDescription"
          value={formData.specialtyDescription || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        />
      </div>

      <CheckboxGroup
        label="Mental Health"
        items={['Anxiety', 'Depression', 'OCD', 'Trauma']}
        field="mentalHealth"
        selected={formData.mentalHealth}
        onChange={handleCheckboxChange}
      />

      <CheckboxGroup
        label="Sexuality"
        items={['Bisexual', 'Gay', 'Lesbian', 'Heterosexual']}
        field="sexuality"
        selected={formData.sexuality}
        onChange={handleCheckboxChange}
      />

      <CheckboxGroup
        label="Ages"
        items={['Children', 'Teens', 'Adults', 'Elders (65+)']}
        field="ages"
        selected={formData.ages}
        onChange={handleCheckboxChange}
      />

      <CheckboxGroup
        label="Participants"
        items={['Individuals', 'Couples', 'Families']}
        field="participants"
        selected={formData.participants}
        onChange={handleCheckboxChange}
      />

      <CheckboxGroup
        label="Communities/Groups"
        items={['Gay Allied', 'HIV / AIDS Allied']}
        field="communities"
        selected={formData.communities}
        onChange={handleCheckboxChange}
      />

      <CheckboxGroup
        label="Faith Orientation"
        items={['Christianity', 'Buddhism']}
        field="faith"
        selected={formData.faith}
        onChange={handleCheckboxChange}
      />

      <CheckboxGroup
        label="Languages"
        items={['English', 'Spanish']}
        field="languages"
        selected={formData.languages}
        onChange={handleCheckboxChange}
      />
    </div>
  )
}

export default SpecialtiesForm
