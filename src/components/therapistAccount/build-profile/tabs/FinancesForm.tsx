// src/components/build-profile/tabs/FinancesForm.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import TextField from '@/components/fields/TextField'
import TextareaField from '@/components/fields/TextareaField'
import SelectDropdown from '@/components/fields/SelectDropdown'

const paymentOptions = ['Zelle', 'Venmo', 'Credit Card', 'Cash', 'PayPal']
const insuranceOptions = [
  { label: 'Aetna', value: 'Aetna' },
  { label: 'Cigna', value: 'Cigna' },
  { label: 'Blue Cross', value: 'Blue Cross' },
  { label: 'UnitedHealthcare', value: 'UnitedHealthcare' },
  { label: 'Kaiser', value: 'Kaiser' },
]

export default function FinancesForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<{
    feeIndividual?: number
    feeCouples?: number
    slidingScale?: boolean
    freeConsultation?: boolean
    feeComment?: string
    paymentMethods: string[]
    // insuranceAccepted?: string
  }>()

  const paymentMethods = watch('paymentMethods') || []

  const togglePaymentMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      setValue(
        'paymentMethods',
        paymentMethods.filter((m) => m !== method),
        { shouldValidate: true }
      )
    } else {
      setValue('paymentMethods', [...paymentMethods, method], {
        shouldValidate: true,
      })
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <span>💰</span>
        <h2>Finances</h2>
      </div>

      {/* Individual therapy fee */}
      <TextField
        label="Individual therapy fee"
        name="feeIndividual"
        type="number"
        register={register}
        placeholder="e.g. 150"
        error={errors.feeIndividual?.message}
      />

      {/* Couples therapy fee */}
      <TextField
        label="Couples therapy fee"
        name="feeCouples"
        type="number"
        register={register}
        placeholder="e.g. 200"
        error={errors.feeCouples?.message}
      />

      {/* Sliding scale */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('slidingScale')}
          className="form-checkbox"
        />
        <span>I offer sliding scale for those who need it</span>
      </label>

      {/* Free consultation */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('freeConsultation')}
          className="form-checkbox"
        />
        <span>I offer a free 15-minute consultation</span>
      </label>

      {/* Comment on fees */}
      <TextareaField
        label="Your comment on fees"
        name="feeComment"
        register={register}
        placeholder="e.g. I offer lower rates for students or early-career professionals."
        rows={3}
        error={errors.feeComment?.message}
      />

      {/* Payment methods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment methods
        </label>
        <div className="flex flex-wrap gap-3">
          {paymentOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={paymentMethods.includes(option)}
                onChange={() => togglePaymentMethod(option)}
                className="form-checkbox text-teal-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.paymentMethods && (
          <p className="mt-1 text-red-600 text-sm">
            {errors.paymentMethods.message}
          </p>
        )}
      </div>

      {/* Insurance accepted */}
      <SelectDropdown
        label="Insurance accepted"
        name="insuranceAccepted"
        options={insuranceOptions}
        register={register}
        error={errors.insuranceAccepted?.message}
      />
    </div>
  )
}
