'use client'

import React from 'react'

interface FinancesFormProps {
  formData: {
    feeIndividual: string
    feeCouples: string
    slidingScale: boolean
    freeConsultation: boolean
    feeComment: string
    paymentMethods: string[]
    insuranceAccepted: string
  }
  handleChange: (e: React.ChangeEvent<any>) => void
  handleArrayToggle: (field: 'paymentMethods', value: string) => void
}

const paymentOptions = ['Zelle', 'Venmo', 'Credit Card', 'Cash', 'PayPal']

export default function FinancesForm({
  formData,
  handleChange,
  handleArrayToggle,
}: FinancesFormProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>💰</span>
        <h2>Finances</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Individual therapy fee</label>
        <input
          name="feeIndividual"
          type="text"
          placeholder="$"
          value={formData.feeIndividual || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Couples therapy fee</label>
        <p className="text-xs text-gray-500 mb-1">
          Leave blank if not offered or same as individual therapy.
        </p>
        <input
          name="feeCouples"
          type="text"
          placeholder="$"
          value={formData.feeCouples || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="slidingScale"
          checked={formData.slidingScale}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-teal-600"
        />
        <label className="text-sm text-gray-700">I offer sliding scale for those who need it</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="freeConsultation"
          checked={formData.freeConsultation}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-teal-600"
        />
        <label className="text-sm text-gray-700">I offer a free 15-minute consultation</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your comment on fees</label>
        <textarea
          name="feeComment"
          value={formData.feeComment || ''}
          onChange={handleChange}
          placeholder="e.g. I offer lower rates for students or early-career professionals."
          rows={3}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
        />
      </div>

      {/* Payment Methods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment methods</label>
        <div className="flex flex-wrap gap-3">
          {paymentOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="paymentMethods"
                checked={formData.paymentMethods.includes(option)}
                onChange={() => handleArrayToggle('paymentMethods', option)}
                className="form-checkbox text-teal-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance accepted</label>
        <select
          name="insuranceAccepted"
          value={formData.insuranceAccepted || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
        >
          <option value="">- Select insurance -</option>
          <option value="Aetna">Aetna</option>
          <option value="Cigna">Cigna</option>
          <option value="Blue Cross">Blue Cross</option>
          <option value="UnitedHealthcare">UnitedHealthcare</option>
          <option value="Kaiser">Kaiser</option>
        </select>
      </div>
    </div>
  )
}
