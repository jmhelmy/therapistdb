// src/components/build-profile/tabs/QualificationsForm.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import TextField from '@/components/fields/TextField'
import SelectDropdown from '@/components/fields/SelectDropdown'
import RadioGroup from '@/components/fields/RadioGroup'

const licenseStatusOptions = [
  { label: "I'm licensed", value: 'licensed' },
  { label: "I'm pre-licensed or under supervision", value: 'pre-licensed' },
  { label: 'I have no license', value: 'none' },
]

const monthOptions = [
  { label: '- Select Month -', value: '' },
  ...[
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ].map((m,i) => ({ label: m, value: i+1 })),
]

const yearOptions = [
  { label: '- Select Year -', value: '' },
  ...Array.from({ length: 20 }, (_, i) => {
    const y = new Date().getFullYear() + i
    return { label: String(y), value: y }
  }),
]

const stateOptions = [
  { label: '- Select State -', value: '' },
  { label: 'California', value: 'CA' },
  { label: 'New York', value: 'NY' },
  { label: 'Texas', value: 'TX' },
  // Add more as needed
]

export default function QualificationsForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{
    licenseStatus?: string
    primaryCredential?: string
    licenseNumber?: string
    licenseState?: string
    licenseExpirationMonth?: string
    licenseExpirationYear?: string
    educationSchool?: string
    educationDegree?: string
    educationYearGraduated?: string
    practiceStartYear?: string
  }>()

  return (
    <div className="space-y-6 bg-white p-8 max-w-2xl mx-auto rounded shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">🎓 Qualifications</h2>

      <RadioGroup
        name="licenseStatus"
        register={register}
        label="License Status (optional)"
        options={licenseStatusOptions}
        error={errors.licenseStatus?.message}
      />

      <TextField
        name="primaryCredential"
        register={register}
        label="Profession / Role (optional)"
        placeholder="e.g. Counselor, Psychotherapist"
        error={errors.primaryCredential?.message}
      />

      <TextField
        name="licenseNumber"
        register={register}
        label="License or Credential Number (optional)"
        placeholder="e.g. 123456 or Org123"
        error={errors.licenseNumber?.message}
      />

      <SelectDropdown
        name="licenseState"
        register={register}
        label="License State (optional)"
        options={stateOptions}
        error={errors.licenseState?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectDropdown
          name="licenseExpirationMonth"
          register={register}
          valueAsNumber
          label="Expiration Month (optional)"
          options={monthOptions}
          error={errors.licenseExpirationMonth?.message}
        />
        <SelectDropdown
          name="licenseExpirationYear"
          valueAsNumber
          format={(value) => {
            if (value === '') {
              return null
            }
            const numValue = Number(value)
            if(isNaN(numValue)) {
              return value
            }
            return numValue
          }}
          register={register}
          label="Expiration Year (optional)"
          options={yearOptions}
          error={errors.licenseExpirationYear?.message}
        />
      </div>

      <TextField
        name="educationSchool"
        register={register}
        label="School Name (optional)"
        placeholder="Most recently graduated"
        error={errors.educationSchool?.message}
      />

      <TextField
        name="educationDegree"
        register={register}
        label="Degree / Diploma (optional)"
        placeholder="e.g. M.A. in Clinical Psychology"
        error={errors.educationDegree?.message}
      />

      <TextField
        name="educationYearGraduated"
        format={(value) => {
          if (value === '') {
            return null
          }
          const numValue = Number(value)
          if(isNaN(numValue)) {
            return value
          }
          return numValue
        }}
        register={register}
        label="Year Graduated (optional)"
        placeholder="e.g. 2018"
        error={errors.educationYearGraduated?.message}
      />

      <TextField
        name="practiceStartYear"
        format={(value) => {
          if (value === '') {
            return null
          }
          const numValue = Number(value)
          if(isNaN(numValue)) {
            return value
          }
          return numValue
        }}
        register={register}
        label="Years in Practice (optional)"
        placeholder="e.g. 5"
        error={errors.practiceStartYear?.message}
      />
    </div>
  )
}
