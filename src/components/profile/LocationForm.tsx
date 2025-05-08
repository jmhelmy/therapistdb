'use client'

import React from 'react'

interface LocationFormProps {
  formData: {
    primaryAddress: string
    primaryCity: string
    primaryState: string
    primaryZip: string
    additionalAddress: string
    additionalCity: string
    additionalState: string
    additionalZip: string
    telehealth: boolean
    inPerson: boolean
    locationDescription: string
  }
  handleChange: (e: React.ChangeEvent<any>) => void
}

export default function LocationForm({ formData, handleChange }: LocationFormProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>📍</span>
        <h2>Location</h2>
      </div>

      {/* Primary Office */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800">Primary Location</h3>
        <input
          name="primaryAddress"
          placeholder="Address"
          value={formData.primaryAddress}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            name="primaryCity"
            placeholder="City"
            value={formData.primaryCity}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
          <input
            name="primaryState"
            placeholder="State"
            value={formData.primaryState}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
          <input
            name="primaryZip"
            placeholder="ZIP"
            value={formData.primaryZip}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Additional Office */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800">Additional Location (optional)</h3>
        <input
          name="additionalAddress"
          placeholder="Address"
          value={formData.additionalAddress}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            name="additionalCity"
            placeholder="City"
            value={formData.additionalCity}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
          <input
            name="additionalState"
            placeholder="State"
            value={formData.additionalState}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
          <input
            name="additionalZip"
            placeholder="ZIP"
            value={formData.additionalZip}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Telehealth & In-Person */}
      <div className="space-y-2">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="telehealth"
            checked={formData.telehealth}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="ml-2">Offers telehealth</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="inPerson"
            checked={formData.inPerson}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="ml-2">Offers in-person</span>
        </label>
      </div>

      {/* Location Description */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Location Description
        </label>
        <textarea
          name="locationDescription"
          value={formData.locationDescription}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
          placeholder="E.g. Office is on the 2nd floor, suite 210"
        />
      </div>
    </div>
  )
}
