'use client'

import { useFormContext } from 'react-hook-form'
import TextField from '@/components/fields/TextField'
import ImageUploadField from '@/components/fields/ImageUploadField'

export default function BasicsForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{
    name: string
    primaryCredential?: string
    primaryCredentialAlt?: string
    phone?: string
    workEmail?: string
    website?: string
    imageUrl?: string
  }>()

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-8 max-w-2xl mx-auto">
      {/* Section header */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>🧾</span>
        <h2>Basics</h2>
      </div>

      {/* Profile Photo Upload */}
      <ImageUploadField
        name="imageUrl"
        label="Profile photo"
      />

      {/* Full Name */}
      <TextField
        label="Full Name"
        name="name"
        register={register}
        error={errors.name?.message}
        placeholder="e.g. Dr. Emily Rivera"
      />

      {/* Credentials */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Credentials Following Name
        </label>
        <p className="text-sm text-gray-500 mb-2">e.g. LMFT, Psychotherapist</p>
        <div className="flex space-x-4">
          <TextField
            name="primaryCredential"
            register={register}
            placeholder="LMFT"
            error={errors.primaryCredential?.message}
          />
          <TextField
            name="primaryCredentialAlt"
            register={register}
            placeholder="Psychotherapist"
            error={errors.primaryCredentialAlt?.message}
          />
        </div>
      </div>

      {/* Phone */}
      <TextField
        label="Phone number"
        name="phone"
        register={register}
        placeholder="e.g. (555) 123-4567"
        error={errors.phone?.message}
      />

      {/* Work Email */}
      <TextField
        label="Email – Premium users only"
        name="workEmail"
        register={register}
        type="email"
        placeholder="e.g. emily@youremail.com"
        error={errors.workEmail?.message}
      />

      {/* Website */}
      <TextField
        label="Website"
        name="website"
        register={register}
        type="url"
        placeholder="e.g. https://yourpractice.com"
        error={errors.website?.message}
      />
    </div>
  )
}
