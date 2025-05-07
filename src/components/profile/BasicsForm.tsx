'use client'

import React, { useState } from 'react'
import { Camera } from 'lucide-react'

interface BasicsFormProps {
  formData: {
    id?: string
    name: string
    primaryCredential: string
    primaryCredentialAlt: string
    phone: string
    email: string
    website: string
    imageUrl?: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function BasicsForm({ formData, handleChange, handleImageUpload }: BasicsFormProps) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const autoSave = async () => {
    if (!formData.id) return
    try {
      await fetch('/api/therapists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } catch (err) {
      console.error('Auto-save failed:', err)
    }
  }

  const handleAndSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e)
    if (timeoutId) clearTimeout(timeoutId)
    const newTimeout = setTimeout(autoSave, 1000) // debounce 1s
    setTimeoutId(newTimeout)
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>🧾</span>
        <h2>Basics</h2>
      </div>

      {/* Profile Photo Upload Box */}
      <div className="w-full flex justify-center">
        <label
          htmlFor="profile-photo"
          className="w-36 h-36 bg-gray-100 border border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition"
        >
          <Camera className="w-6 h-6 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Profile photo</span>
          <input
            id="profile-photo"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleAndSave}
            placeholder="e.g. Dr. Emily Rivera"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Credentials Following Name</label>
          <p className="text-sm text-gray-500 mb-2">e.g. LMFT, Psychotherapist</p>
          <div className="flex space-x-4">
            <input
              name="primaryCredential"
              value={formData.primaryCredential}
              onChange={handleAndSave}
              placeholder=""
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <input
              name="primaryCredentialAlt"
              value={formData.primaryCredentialAlt}
              onChange={handleAndSave}
              placeholder=""
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Phone number<span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">For clients to call</p>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleAndSave}
            placeholder=""
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Email – Premium users only</label>
          <p className="text-sm text-gray-500 mb-2">For clients to email</p>
          <input
            name="email"
            value={formData.email}
            onChange={handleAndSave}
            placeholder=""
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Website</label>
          <p className="text-sm text-gray-500 mb-2">School most recently graduated</p>
          <input
            name="website"
            value={formData.website}
            onChange={handleAndSave}
            placeholder=""
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>
    </div>
  )
}
