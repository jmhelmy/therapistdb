// src/components/build-profile/tabs/PersonalStatementForm.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import { Feather } from 'lucide-react'
import TextField from '@/components/fields/TextField'
import TextareaField from '@/components/fields/TextareaField'

export default function PersonalStatementForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{
    tagline?: string
    personalStatement1?: string
    personalStatement2?: string
    personalStatement3?: string
  }>()

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <Feather className="w-5 h-5" />
        <h2>Personal Statement</h2>
      </div>

      {/* Tagline */}
      <TextField
        name="tagline"
        label="Tagline for service (optional)"
        register={register}
        placeholder="e.g. Grounded, compassionate therapy for individuals..."
        error={errors.tagline?.message}
      />

      {/* Part 1 */}
      <TextareaField
        name="personalStatement1"
        register={register}
        label="Personal statement – Part 1 (optional)"
        placeholder="Tell your story. E.g. I’m Dr. Rivera, a licensed psychologist..."
        rows={5}
        error={errors.personalStatement1?.message}
      />

      {/* Part 2 */}
      <TextareaField
        name="personalStatement2"
        register={register}
        label="Personal statement – Part 2 (optional)"
        placeholder="What issues do you specialize in? E.g. I work with anxiety, depression..."
        rows={5}
        error={errors.personalStatement2?.message}
      />

      {/* Part 3 */}
      <TextareaField
        name="personalStatement3"
        register={register}
        label="Personal statement – Part 3 (optional)"
        placeholder="How do you work? E.g. My approach is collaborative, strengths-based..."
        rows={5}
        error={errors.personalStatement3?.message}
      />
    </div>
  )
}
