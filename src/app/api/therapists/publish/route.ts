'use client'

import { useState, useEffect, useRef } from 'react'
import debounce from 'lodash.debounce'

import BasicsForm from '@/components/profile/BasicsForm'
import LocationForm from '@/components/profile/LocationForm'
import FinancesForm from '@/components/profile/FinancesForm'
import QualificationsForm from '@/components/profile/QualificationsForm'
import PersonalStatementForm from '@/components/profile/PersonalStatementForm'
import SpecialtiesForm from '@/components/profile/SpecialtiesForm'
import TreatmentStyleForm from '@/components/profile/TreatmentStyleForm'

export default function BuildProfilePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
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
    languages: [] as string[],
    clientConcerns: [] as string[],
    topConcerns: [] as string[],
    typesOfTherapy: [] as string[],
    services: [] as string[],
    ages: [] as string[],
    communities: [] as string[],
    groups: [] as string[],
    faith: [] as string[],
    participants: [] as string[],
    specialtyDescription: '',
    treatmentApproach: '',
    primaryOffice: ''
  })

  // load the therapist ID once
  useEffect(() => {
    const id = localStorage.getItem('therapistId')
    if (id) setFormData(prev => ({ ...prev, id }))
  }, [])

  // helper handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (field: string, value: string) => {
    const prev = formData[field as keyof typeof formData] as string[]
    const updated = prev.includes(value)
      ? prev.filter(v => v !== value)
      : [...prev, value]
    setFormData(prev => ({ ...prev, [field]: updated }))
  }

  const handleStarredChange = (value: string) => {
    const updated = formData.topConcerns.includes(value)
      ? formData.topConcerns.filter(item => item !== value)
      : [...formData.topConcerns, value].slice(0, 3)
    setFormData(prev => ({ ...prev, topConcerns: updated }))
  }

  // manual save & publish (still available on “Preview”)
  const handleSubmit = async () => {
    await fetch('/api/therapists', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    alert('Profile updated!')
  }

  const handlePublish = async () => {
    if (!formData.name) {
      alert('Please enter your name before publishing.')
      return
    }
    const res = await fetch('/api/therapists/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: formData.id, name: formData.name }),
    })
    const data = await res.json()
    alert(data.success ? 'Profile published!' : `Publish failed: ${data.message}`)
  }

  // DEBOUNCED AUTO-SAVE
  const debouncedSave = useRef(
    debounce(async (data) => {
      await fetch('/api/therapists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }, 1000)
  ).current

  // call auto-save on every formData change (except before we have an ID)
  useEffect(() => {
    if (formData.id) debouncedSave(formData)
  }, [formData, debouncedSave])

  // clean up on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

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
              className={`mr-4 mb-2 px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                step === i + 1
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
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
              handleCheckboxChange={handleCheckboxChange}
              handleStarredChange={handleStarredChange}
            />
          )}
          {step === 7 && (
            <TreatmentStyleForm
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={handlePublish}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
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
