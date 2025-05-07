'use client'

import React, { useState } from 'react'

interface FinancesFormProps {
  formData: {
    id?: string
    fees: string
    couplesFee?: string
    slidingScale?: boolean
    freeConsultation?: boolean
    billing: string
    paymentMethods: string
    insurance: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export default function FinancesForm({ formData, handleChange }: FinancesFormProps) {
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

  const handleAndSave = (e: React.ChangeEvent<any>) => {
    handleChange(e)
    if (timeoutId) clearTimeout(timeoutId)
    const newTimeout = setTimeout(autoSave, 1000)
    setTimeoutId(newTimeout)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">💳 Finances</h2>

      <div>
        <label className="block text-sm font-semibold mb-1">Individual therapy fee</label>
        <input
          type="text"
          name="fees"
          value={formData.fees}
          onChange={handleAndSave}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
          placeholder="$"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Couples therapy fee</label>
        <p className="text-sm text-gray-500 mb-1">
          If couples therapy isn’t offered, or is the same as individual therapy, leave blank
        </p>
        <input
          type="text"
          name="couplesFee"
          value={formData.couplesFee || ''}
          onChange={handleAndSave}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
          placeholder="$"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="slidingScale"
          checked={formData.slidingScale || false}
          onChange={(e) =>
            handleAndSave({
              target: {
                name: 'slidingScale',
                value: String(e.target.checked),
              },
            } as any)
          }
        />
        <label className="text-sm">Yes, I offer sliding scale for those who need it</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="freeConsultation"
          checked={formData.freeConsultation || false}
          onChange={(e) =>
            handleAndSave({
              target: {
                name: 'freeConsultation',
                value: String(e.target.checked),
              },
            } as any)
          }
        />
        <label className="text-sm">
          Yes, I offer a free 15-minute consultation to also see if it’s a good fit
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Your comment on fees and insurance</label>
        <p className="text-sm text-gray-500 mb-1">
          In your own words, describe the fees and insurance or add additional context
        </p>
        <textarea
          name="billing"
          value={formData.billing}
          onChange={handleAndSave}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Payment methods</label>
        <p className="text-sm text-gray-500 mb-1">e.g. Zelle, Venmo, Credit Card</p>
        <textarea
          name="paymentMethods"
          value={formData.paymentMethods}
          onChange={handleAndSave}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Insurance</label>
        <p className="text-sm text-gray-500 mb-1">Select any insurance that you accept</p>
        <select
          name="insurance"
          value={formData.insurance}
          onChange={handleAndSave}
          className="w-full px-4 py-2 border rounded bg-[#f1f5f9]"
        >
          <option value="">- Select insurance -</option>
          <option value="Aetna">Aetna</option>
          <option value="Cigna">Cigna</option>
          <option value="Blue Cross">Blue Cross</option>
          <option value="UnitedHealthcare">UnitedHealthcare</option>
        </select>
      </div>
    </div>
  )
}
