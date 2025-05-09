'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

interface Props {
  name: string
  label: string
}

export default function ImageUploadField({ name, label }: Props) {
  const { setValue, watch } = useFormContext<any>()
  const imageUrl = watch(name) as string

  const openWidget = () => {
    // @ts-ignore
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'YOUR_CLOUD_NAME',     // ← replace this
        uploadPreset: 'therapist_preset',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: false,
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Cloudinary Widget Error:', error)
          return
        }
        if (result.event === 'success') {
          setValue(name, result.info.secure_url, { shouldValidate: true })
        }
      }
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className="relative w-36 h-36 bg-gray-100 border border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        onClick={openWidget}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="object-cover w-full h-full rounded"
          />
        ) : (
          <span className="text-sm text-gray-600">Upload Image</span>
        )}
      </div>
    </div>
  )
}
