'use client'

import React from 'react'

interface LocationFormProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function LocationForm({ formData, handleChange }: LocationFormProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 space-y-10 max-w-3xl mx-auto">
      <div className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
        <span>📍</span>
        <h2>Location</h2>
      </div>

      {/* Primary Location */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800">Primary Location</h3>
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
        <input name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
      </div>

      {/* Additional Location */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800">Additional Location</h3>
        <input name="address2" placeholder="Address" value={formData.address2} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
        <input name="city2" placeholder="City" value={formData.city2} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
        <input name="state2" placeholder="State" value={formData.state2} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
        <input name="zip2" placeholder="Zip Code" value={formData.zip2} onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded" />
      </div>

      {/* Telehealth & In-Person */}
      <div>
        <h3 className="font-bold text-gray-800 mb-1">Telehealth and In-Person</h3>
        <p className="text-sm text-gray-500 mb-3">
          Put a star next to the issues that are a top issue that you work with. Maximum 3 top issues
        </p>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="inPerson"
              checked={formData.inPerson}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, value: e.target.checked } })}
            />
            <span>In-person</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="teletherapy"
              checked={formData.teletherapy}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, value: e.target.checked } })}
            />
            <span>Teletherapy</span>
          </label>
        </div>
      </div>

      {/* Location In Your Own Words */}
      <div>
        <h3 className="font-bold text-gray-800 mb-1">Location in your own words</h3>
        <p className="text-sm text-gray-500 mb-2">
          Any thoughts about how to get there, or remote vs teletherapy
        </p>
        <textarea
          name="locationNotes"
          value={formData.locationNotes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded resize-none"
        />
      </div>

      {/* SEO Location */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center space-x-2">
          <span>📍</span>
          <span>SEO Location</span>
        </h3>

        {/* Zip Codes */}
        <div>
          <p className="font-medium text-gray-700">Nearby zip codes</p>
          {[1, 2, 3].map((i) => (
            <input
              key={i}
              name={`nearbyZip${i}`}
              placeholder="Zip Code"
              value={formData[`nearbyZip${i}`] || ''}
              onChange={handleChange}
              className="w-full mt-1 mb-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            />
          ))}
        </div>

        {/* Cities */}
        <div>
          <p className="font-medium text-gray-700">Nearby cities</p>
          {[1, 2, 3].map((i) => (
            <input
              key={i}
              name={`nearbyCity${i}`}
              placeholder="City"
              value={formData[`nearbyCity${i}`] || ''}
              onChange={handleChange}
              className="w-full mt-1 mb-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
