// components/FormInput.tsx
import React from 'react'

export default function FormInput({
  label,
  placeholder,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
}: {
  label: string
  placeholder: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}{required && '*'}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        required={required}
      />
    </div>
  )
}
