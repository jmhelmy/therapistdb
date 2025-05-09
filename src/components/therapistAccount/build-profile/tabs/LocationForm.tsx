// src/components/build-profile/tabs/LocationForm.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import TextField from '@/components/fields/TextField'
import TextareaField from '@/components/fields/TextareaField'
import CheckboxSingle from '@/components/fields/CheckboxSingle'

export default function LocationForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{
    primaryAddress?: string
    primaryCity?: string
    primaryState?: string
    primaryZip?: string
    additionalAddress?: string
    additionalCity?: string
    additionalState?: string
    additionalZip?: string
    telehealth?: boolean
    inPerson?: boolean
    locationDescription?: string
  }>()

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>📍</span>
        <h2>Location</h2>
      </div>

      {/* Primary Location */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800">Primary Location</h3>
        <TextField
          name="primaryAddress"
          register={register}
          placeholder="Address"
          error={errors.primaryAddress?.message}
        />
        <div className="grid grid-cols-3 gap-4">
          <TextField
            name="primaryCity"
            register={register}
            placeholder="City"
            error={errors.primaryCity?.message}
          />
          <TextField
            name="primaryState"
            register={register}
            placeholder="State"
            error={errors.primaryState?.message}
          />
          <TextField
            name="primaryZip"
            register={register}
            placeholder="ZIP"
            error={errors.primaryZip?.message}
          />
        </div>
      </div>

      {/* Additional Location */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800">Additional Location (optional)</h3>
        <TextField
          name="additionalAddress"
          register={register}
          placeholder="Address"
          error={errors.additionalAddress?.message}
        />
        <div className="grid grid-cols-3 gap-4">
          <TextField
            name="additionalCity"
            register={register}
            placeholder="City"
            error={errors.additionalCity?.message}
          />
          <TextField
            name="additionalState"
            register={register}
            placeholder="State"
            error={errors.additionalState?.message}
          />
          <TextField
            name="additionalZip"
            register={register}
            placeholder="ZIP"
            error={errors.additionalZip?.message}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('telehealth')}
            className="form-checkbox"
          />
          <span>Offers telehealth</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('inPerson')}
            className="form-checkbox"
          />
          <span>Offers in-person</span>
        </label>
      </div>

      {/* Description */}
      <TextareaField
        name="locationDescription"
        register={register}
        label="Location Description (optional)"
        placeholder="E.g. Office is on the 2nd floor, suite 210"
        rows={3}
        error={errors.locationDescription?.message}
      />
    </div>
  )
}