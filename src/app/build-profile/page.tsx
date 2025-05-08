'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import BasicsForm from '@/components/profile/BasicsForm'
import LocationForm from '@/components/profile/LocationForm'
import FinancesForm from '@/components/profile/FinancesForm'
import QualificationsForm from '@/components/profile/QualificationsForm'
import PersonalStatementForm from '@/components/profile/PersonalStatementForm'
import SpecialtiesForm from '@/components/profile/SpecialtiesForm'
import TreatmentStyleForm from '@/components/profile/TreatmentStyleForm'

interface FormData {
  id: string
  published: boolean
  slug: string
  imageUrl: string

  name: string
  primaryCredential: string
  primaryCredentialAlt: string
  gender: string
  phone: string
  workEmail: string
  website: string

  primaryAddress: string
  primaryCity: string
  primaryState: string
  primaryZip: string
  additionalAddress: string
  additionalCity: string
  additionalState: string
  additionalZip: string
  telehealth: boolean
  inPerson: boolean
  locationDescription: string

  seoZip1: string
  seoZip2: string
  seoZip3: string
  nearbyCity1: string
  nearbyCity2: string
  nearbyCity3: string

  feeIndividual: string
  feeCouples: string
  slidingScale: boolean
  freeConsultation: boolean
  feeComment: string
  paymentMethods: string[]
  insuranceAccepted: string

  licenseStatus: string
  profession: string
  licenseNumber: string
  licenseState: string
  licenseExpirationMonth: number
  licenseExpirationYear: number

  educationSchool: string
  educationDegree: string
  educationYearGraduated: number
  practiceStartYear: number

  tagline: string

  personalStatement1: string
  personalStatement2: string
  personalStatement3: string

  issues: string[]
  specialtyDescription: string
  mentalHealthRoles: string[]
  sexuality: string
  ages: string[]
  participants: string[]
  communities: string[]
  languages: string[]
  topIssues: string[]

  treatmentStyle: string[]
  treatmentStyleDescription: string
}

export default function BuildProfilePage() {
  const { status } = useSession()
  const router = useRouter()

  const tabs = [
    'Basics',
    'Location',
    'Finances',
    'Qualifications',
    'Personal Statement',
    'Specialties',
    'Treatment Style',
    'Preview',
  ]
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<FormData>({
    id: '',
    slug: '',
    imageUrl: '',
    published: false,

    name: '',
    primaryCredential: '',
    primaryCredentialAlt: '',
    gender: '',
    phone: '',
    workEmail: '',
    website: '',

    primaryAddress: '',
    primaryCity: '',
    primaryState: '',
    primaryZip: '',
    additionalAddress: '',
    additionalCity: '',
    additionalState: '',
    additionalZip: '',
    telehealth: false,
    inPerson: false,
    locationDescription: '',

    seoZip1: '',
    seoZip2: '',
    seoZip3: '',
    nearbyCity1: '',
    nearbyCity2: '',
    nearbyCity3: '',

    feeIndividual: '',
    feeCouples: '',
    slidingScale: false,
    freeConsultation: false,
    feeComment: '',
    paymentMethods: [],
    insuranceAccepted: '',

    licenseStatus: '',
    profession: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpirationMonth: 0,
    licenseExpirationYear: 0,

    educationSchool: '',
    educationDegree: '',
    educationYearGraduated: 0,
    practiceStartYear: 0,

    tagline: '',

    personalStatement1: '',
    personalStatement2: '',
    personalStatement3: '',

    issues: [],
    specialtyDescription: '',
    mentalHealthRoles: [],
    sexuality: '',
    ages: [],
    participants: [],
    communities: [],
    languages: [],
    topIssues: [],

    treatmentStyle: [],
    treatmentStyleDescription: '',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Redirect if not signed in
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="p-8 text-center">Loading…</div>
  }

  // Load existing or seeded profile
  useEffect(() => {
    fetch('/api/therapists/me')
      .then(async r => {
        if (r.status === 204) return null
        if (!r.ok) {
          console.error('Load failed:', r.status, await r.text())
          return null
        }
        const txt = await r.text()
        try {
          return txt ? JSON.parse(txt) : null
        } catch {
          console.error('JSON parse error on /api/therapists/me:', txt)
          return null
        }
      })
      .then((d: FormData | null) => {
        if (d?.id) {
          setFormData({
            ...d,
            licenseExpirationMonth: d.licenseExpirationMonth ?? 0,
            licenseExpirationYear: d.licenseExpirationYear ?? 0,
            educationYearGraduated: d.educationYearGraduated ?? 0,
            practiceStartYear: d.practiceStartYear ?? 0,
          })
        }
      })
      .catch(err => console.error('Unexpected load error:', err))
  }, [router])

  // Save helper: POST if new, PUT otherwise
  const saveToServer = useCallback(async (data: FormData) => {
    setIsSaving(true)
    setSaveError(null)
    try {
      const method = data.id ? 'PUT' : 'POST'
      const res = await fetch('/api/therapists', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const txt = await res.text()
      if (!res.ok) throw new Error(txt || 'Save failed')
      if (!data.id) {
        const obj = JSON.parse(txt)
        setFormData(f => ({ ...f, id: obj.id }))
      }
    } catch (err: any) {
      setSaveError(err.message)
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Handlers
  const handleChange = useCallback((e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target
    setFormData(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }, [])

  const handleArrayToggle = useCallback((field: keyof FormData, value: string) => {
    setFormData(f => {
      const arr = f[field] as string[]
      return {
        ...f,
        [field]: arr.includes(value)
          ? arr.filter(x => x !== value)
          : [...arr, value],
      }
    })
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !formData.id) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`/api/therapists/${formData.id}/upload`, {
      method: 'POST',
      body: fd,
    })
    const txt = await res.text()
    if (res.ok && txt) {
      const { url } = JSON.parse(txt)
      setFormData(f => ({ ...f, imageUrl: url }))
    }
  }

  // Publish
  const doPublish = async () => {
    await saveToServer(formData)
    const res = await fetch('/api/therapists/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: formData.id }),
    })
    const txt = await res.text()
    if (!res.ok) alert(`Publish failed: ${txt}`)
    else setFormData(f => ({ ...f, published: true }))
  }

  // Wizard nav
  const next = async () => {
    await saveToServer(formData)
    setStep(s => Math.min(tabs.length, s + 1))
  }
  const back = () => setStep(s => Math.max(1, s - 1))

  return (
    <div className="min-h-screen bg-[#fafbfa] py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md">

        {/* Header & Publish */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          {!formData.published && (
            <button
              onClick={doPublish}
              disabled={!formData.id || !formData.name}
              className="bg-teal-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Publish
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 p-4 border-b">
          {tabs.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              disabled={isSaving}
              className={`px-3 py-1 rounded-full text-sm transition ${
                step === i + 1
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isSaving && <div className="text-gray-500">Saving…</div>}
          {saveError && <div className="text-red-600">Error: {saveError}</div>}

          {step === 1 && (
            <BasicsForm
              formData={formData}
              handleChange={handleChange}
              handleImageUpload={handleImageUpload}
            />
          )}
          {step === 2 && <LocationForm formData={formData} handleChange={handleChange} />}
          {step === 3 && <FinancesForm formData={formData} handleChange={handleChange} />}
          {step === 4 && <QualificationsForm formData={formData} handleChange={handleChange} />}
          {step === 5 && <PersonalStatementForm formData={formData} handleChange={handleChange} />}
          {step === 6 && (
            <SpecialtiesForm
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={v => handleArrayToggle('issues', v)}
            />
          )}
          {step === 7 && (
            <TreatmentStyleForm
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={v => handleArrayToggle('treatmentStyle', v)}
            />
          )}
          {step === 8 && (
            <div>
              <h3 className="text-xl font-bold">Preview JSON</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t p-4 bg-white">
          {step > 1 ? (
            <button onClick={back} className="px-4 py-2 border rounded">
              Back
            </button>
          ) : (
            <div />
          )}
          {step < tabs.length && (
            <button
              onClick={next}
              disabled={isSaving}
              className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
            >
              Save & Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
