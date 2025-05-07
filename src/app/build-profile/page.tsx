
'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import debounce from 'lodash.debounce'

import BasicsForm from '@/components/profile/BasicsForm'
import LocationForm from '@/components/profile/LocationForm'
import FinancesForm from '@/components/profile/FinancesForm'
import QualificationsForm from '@/components/profile/QualificationsForm'
import PersonalStatementForm from '@/components/profile/PersonalStatementForm'
import SpecialtiesForm from '@/components/profile/SpecialtiesForm'
import TreatmentStyleForm from '@/components/profile/TreatmentStyleForm'

// Define a type for your form data to get autocomplete and safety
interface FormData {
  id: string
  name: string
  slug: string
  imageUrl: string
  city: string
  state: string
  licenseStatus: string
  licenseNumber: string
  licenseState: string
  licenseExpiration: string
  primaryCredential: string
  description: string
  billing: string
  fees: string
  paymentMethods: string
  insurance: string
  npi: string
  languages: string[]
  clientConcerns: string[]
  topConcerns: string[]
  typesOfTherapy: string[]
  services: string[]
  ages: string[]
  communities: string[]
  groups: string[]
  faith: string[]
  participants: string[]
  specialtyDescription: string
  treatmentApproach: string
  primaryOffice: string
}

export default function BuildProfilePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    slug: '',
    imageUrl: '',
    city: '',
    state: '',
    licenseStatus: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiration: '',
    primaryCredential: '',
    description: '',
    billing: '',
    fees: '',
    paymentMethods: '',
    insurance: '',
    npi: '',
    languages: [],
    clientConcerns: [],
    topConcerns: [],
    typesOfTherapy: [],
    services: [],
    ages: [],
    communities: [],
    groups: [],
    faith: [],
    participants: [],
    specialtyDescription: '',
    treatmentApproach: '',
    primaryOffice: ''
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Load therapist ID once
  useEffect(() => {
    const id = localStorage.getItem('therapistId')
    if (id) setFormData(prev => ({ ...prev, id }))
  }, [])

  /**
   * Save data via API
   */
  const saveToServer = useCallback(async (data: FormData) => {
    // no-op if no id yet
    if (!data.id) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/therapists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Save failed')
    } catch (err: any) {
      console.error('Auto-save error:', err)
      setSaveError(err.message || 'Error saving')
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Debounce the save function so it's not spamming the server
  const debouncedSave = useMemo(
    () => debounce((data: FormData) => saveToServer(data), 1000),
    [saveToServer]
  )

  // Auto-save effect when formData changes
  useEffect(() => {
    debouncedSave(formData)
  }, [formData, debouncedSave])

  // On unmount flush any pending saves
  useEffect(() => () => debouncedSave.cancel(), [debouncedSave])

  // Handlers
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleCheckboxChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => {
      const list = prev[field] as string[]
      const nextList = list.includes(value)
        ? list.filter(item => item !== value)
        : [...list, value]
      return { ...prev, [field]: nextList }
    })
  }, [])

  const handleStarredChange = useCallback((value: string) => {
    setFormData(prev => {
      const starred = prev.topConcerns
      const updated = starred.includes(value)
        ? starred.filter(x => x !== value)
        : [...starred, value].slice(0, 3)
      return { ...prev, topConcerns: updated }
    })
  }, [])

  /** Manual Save */
  const handleSubmit = async () => {
    // flush pending auto-saves
    debouncedSave.flush()
    await saveToServer(formData)
    alert('Profile updated!')
  }

  /** Publish */
  const handlePublish = async () => {
    debouncedSave.flush()
    if (!formData.name) {
      alert('Please enter your name before publishing.')
      return
    }

    try {
      const res = await fetch('/api/therapists/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: formData.id, name: formData.name }),
      })
      const data = await res.json()
      alert(data.success ? 'Profile published!' : `Publish failed: ${data.message}`)
    } catch (err) {
      console.error('Publish error:', err)
      alert('An error occurred while publishing.')
    }
  }

  const tabLabels = [
    'Basics',
    'Location',
    'Finances',
    'Qualifications',
    'Personal Statement',
    'Specialties & Focus',
    'Treatment Style',
    'Preview',
  ]

  return (
    <div className="min-h-screen bg-[#fafbfa] py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md">
        {/* Tab Nav */}
        <div className="flex flex-wrap border-b px-6 pt-6">
          {tabLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              disabled={isSaving}
              className={`mr-4 mb-2 px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                step === i + 1
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          { /** Show a spinner or banner when auto-saving */ }
          {isSaving && (
            <div className="text-sm text-gray-500">Saving changes...</div>
          )}
          {saveError && (
            <div className="text-sm text-red-600">Error saving: {saveError}</div>
          )}

          {/* Steps */}
          {step === 1 && <BasicsForm formData={formData} handleChange={handleChange} />}
          {step === 2 && <LocationForm formData={formData} handleChange={handleChange} />}
          {step === 3 && <FinancesForm formData={formData} handleChange={handleChange} />}
          {step === 4 && <QualificationsForm formData={formData} handleChange={handleChange} />}
          {step === 5 && <PersonalStatementForm formData={formData} handleChange={handleChange} />}
          {step === 6 && (
            <SpecialtiesForm
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={(value) => handleCheckboxChange('clientConcerns', value)}
              handleStarredChange={handleStarredChange}
            />
          )}
          {step === 7 && (
            <TreatmentStyleForm
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={(value) => handleCheckboxChange('services', value)}
            />
          )}
          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Preview</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isSaving}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  Publish
                </button>
              </div>
            </div>
          )}

          {/* Prev/Next */}
          <div className="flex justify-between pt-6 border-t">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isSaving}
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < tabLabels.length && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                disabled={isSaving}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
