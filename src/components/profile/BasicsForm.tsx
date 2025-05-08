'use client'

import React from 'react'
import { Camera } from 'lucide-react'

interface BasicsFormProps {
  formData: {
    id?: string
    name: string
    primaryCredential: string
    primaryCredentialAlt: string
    phone: string
    workEmail: string
    website: string
    imageUrl?: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function BasicsForm({
  formData,
  handleChange,
  handleImageUpload,
}: BasicsFormProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-8 max-w-2xl mx-auto">

      {/* Section header */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>🧾</span>
        <h2>Basics</h2>
      </div>

      {/* Profile Photo Upload Box */}
      <div className="w-full flex justify-center">
        <label
          htmlFor="profile-photo"
          className="relative w-36 h-36 bg-gray-100 border border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition overflow-hidden"
        >
          {formData.imageUrl
            ? (
              <img
                src={formData.imageUrl}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            )
            : (
              <div className="flex flex-col items-center">
                <Camera className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-600 mt-1">Profile photo</span>
              </div>
            )
          }
          <input
            id="profile-photo"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Emily Rivera"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        {/* Credentials */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Credentials Following Name
          </label>
          <p className="text-sm text-gray-500 mb-2">e.g. LMFT, Psychotherapist</p>
          <div className="flex space-x-4">
            <input
              name="primaryCredential"
              value={formData.primaryCredential}
              onChange={handleChange}
              placeholder="LMFT"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <input
              name="primaryCredentialAlt"
              value={formData.primaryCredentialAlt}
              onChange={handleChange}
              placeholder="Psychotherapist"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Phone number<span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">For clients to call</p>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. (555) 123-4567"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Email – Premium users only
          </label>
          <p className="text-sm text-gray-500 mb-2">For clients to email</p>
          <input
            name="workEmail"
            type="email"
            value={formData.workEmail}
            onChange={handleChange}
            placeholder="e.g. emily@youremail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Website
          </label>
          <p className="text-sm text-gray-500 mb-2">e.g. https://yourpractice.com</p>
          <input
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="e.g. https://yourpractice.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>
    </div>
  )
}
