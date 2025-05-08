'use client'

import React from 'react'

interface QualificationsFormProps {
  formData: {
    licenseStatus: string
    primaryCredential: string
    licenseNumber: string
    licenseState: string
    licenseExpirationMonth: string // still string in form
    licenseExpirationYear: string
    schoolName: string
    degree: string
    graduationYear: string
    yearsInPractice: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function QualificationsForm({ formData, handleChange }: QualificationsFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">🎓 Qualifications</h2>

      {/* License Status */}
      <div>
        <label className="block text-sm font-semibold mb-2">License Status</label>
        <div className="space-y-2">
          {['licensed', 'pre-licensed', 'none'].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <input
                type="radio"
                name="licenseStatus"
                value={status}
                checked={formData.licenseStatus === status}
                onChange={handleChange}
              />
              <label className="text-sm capitalize">
                {status === 'licensed'
                  ? "I'm licensed"
                  : status === 'pre-licensed'
                  ? "I'm pre-licensed or under supervision"
                  : 'I have no license'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Profession / Mental Health Role
        </label>
        <input
          type="text"
          name="primaryCredential"
          value={formData.primaryCredential}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
          placeholder="e.g. Counselor, Psychotherapist"
        />
      </div>

      {/* License Number */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          License or Credential Number
        </label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
          placeholder="License/Organization/"
        />
      </div>

      {/* License State */}
      <div>
        <label className="block text-sm font-semibold mb-1">License or Credential State</label>
        <select
          name="licenseState"
          value={formData.licenseState}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        >
          <option value="">- Select State -</option>
          <option value="CA">California</option>
          <option value="NY">New York</option>
          <option value="TX">Texas</option>
          {/* Add more states as needed */}
        </select>
      </div>

      {/* License Expiration */}
      <div>
        <label className="block text-sm font-semibold mb-1">License/Credential Expiration</label>
        <div className="flex space-x-2">
          <select
            name="licenseExpirationMonth"
            value={formData.licenseExpirationMonth}
            onChange={handleChange}
            className="w-1/2 px-4 py-2 border rounded bg-[#f1f5f9]"
          >
            <option value="">- Select Month -</option>
            {[
              { label: 'January', value: '1' },
              { label: 'February', value: '2' },
              { label: 'March', value: '3' },
              { label: 'April', value: '4' },
              { label: 'May', value: '5' },
              { label: 'June', value: '6' },
              { label: 'July', value: '7' },
              { label: 'August', value: '8' },
              { label: 'September', value: '9' },
              { label: 'October', value: '10' },
              { label: 'November', value: '11' },
              { label: 'December', value: '12' },
            ].map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            name="licenseExpirationYear"
            value={formData.licenseExpirationYear}
            onChange={handleChange}
            className="w-1/2 px-4 py-2 border rounded bg-[#f1f5f9]"
          >
            <option value="">- Select Year -</option>
            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* School Name */}
      <div>
        <label className="block text-sm font-semibold mb-1">Education - School Name</label>
        <input
          type="text"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
          placeholder="School most recently graduated"
        />
      </div>

      {/* Degree */}
      <div>
        <label className="block text-sm font-semibold mb-1">Education - Degree/Diploma</label>
        <input
          type="text"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        />
      </div>

      {/* Year Graduated */}
      <div>
        <label className="block text-sm font-semibold mb-1">Year Graduated (YYYY)</label>
        <input
          type="text"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        />
      </div>

      {/* Years in Practice */}
      <div>
        <label className="block text-sm font-semibold mb-1">Years in Practice (YYYY)</label>
        <input
          type="text"
          name="yearsInPractice"
          value={formData.yearsInPractice}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        />
      </div>
    </div>
  )
}
