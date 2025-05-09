// src/components/fields/RadioGroup.tsx
'use client'

import React from 'react'

type Option = {
  label: string
  value: string
}

type Props = {
  label: string
  name: string
  options: Option[]
  error?: string
  register: ReturnType<typeof import('react-hook-form')['useForm']>['register']
}

export default function RadioGroup({ label, name, options, error, register }: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              value={option.value}
              {...register(name)}
              className="form-radio text-teal-600"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
