// src/components/build-profile/tabs/SpecialtiesForm.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import TextareaField from '@/components/fields/TextareaField'

const CheckboxGroup = ({
  label,
  items,
  field,
}: {
  label: string
  items: string[]
  field: string
}) => {
  const { register, formState: { errors } } = useFormContext()
  return (
    <div>
      <p className="text-sm font-semibold mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <label key={item} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={item}
              {...register(field)}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{item}</span>
          </label>
        ))}
      </div>
      {errors[field] && (
        <p className="mt-1 text-red-600 text-sm">
          {(errors[field] as any).message}
        </p>
      )}
    </div>
  )
}

export default function SpecialtiesForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{
    specialtyDescription?: string
    clientConcerns?: string[]
    topConcerns?: string[]
    mentalHealth?: string[]
    sexuality?: string[]
    ages?: string[]
    participants?: string[]
    communities?: string[]
    faith?: string[]
    languages?: string[]
  }>()

  return (
    <div className="space-y-6 bg-white p-8 max-w-2xl mx-auto rounded shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">🧠 Specialties & Client Focus</h2>

      {/* Free-text description */}
      <TextareaField
        label="Describe your specialty & client focus (optional)"
        placeholder="E.g. I specialize in supporting LGBTQ+ individuals with anxiety and trauma."
        rows={4}
        name="specialtyDescription"
        register={register}
        error={errors.specialtyDescription?.message}
      />

      {/* Checkbox categories */}
      <CheckboxGroup
        label="Client Concerns"
        items={['Anxiety', 'Depression', 'Trauma', 'Self-Esteem']}
        field="issues"
      />
      <CheckboxGroup
        label="Top Concerns (up to 3)"
        items={['Anxiety', 'Depression', 'Grief']}
        field="topIssues"
      />
      <CheckboxGroup
        label="Mental Health"
        items={['ADHD', 'Bipolar', 'OCD']}
        field="mentalHealthInterests"
      />
      <CheckboxGroup
        label="Sexuality"
        items={['Heterosexual', 'Gay', 'Bisexual']}
        field="sexualityInterests"
      />
      <CheckboxGroup
        label="Ages"
        items={['Children', 'Teens', 'Adults', 'Elders (65+)']}
        field="ages"
      />
      <CheckboxGroup
        label="Participants"
        items={['Individuals', 'Couples', 'Families']}
        field="participants"
      />
      <CheckboxGroup
        label="Communities"
        items={['LGBTQ+', 'Veterans', 'Immigrants']}
        field="communities"
      />
      <CheckboxGroup
        label="Faith"
        items={['Christian', 'Jewish', 'Muslim']}
        field="faithInterests"
      />
      <CheckboxGroup
        label="Languages"
        items={['English', 'Spanish', 'Mandarin']}
        field="languages"
      />
    </div>
  )
}
