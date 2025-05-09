'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import useLoadTherapistData from './hooks/useLoadTherapistData'
import BuildProfileHeader from './BuildProfileHeader'
import StepTabs from './StepTabs'
import WizardFormBody from './WizardFormBody'
import StepFooter from './StepFooter'

const TABS = [
  'Basics',
  'Location',
  'Finances',
  'Qualifications',
  'PersonalStatement',
  'Specialties',
  'TreatmentStyle',
] as const

export type Tab = typeof TABS[number]
export type FormData = {
  id?: string
  name?: string
  published?: boolean
  slug?: string
}

export default function ProfileWizard() {
  const router = useRouter()
  const methods = useForm<FormData>({
    defaultValues: { name: '', published: false },
    mode: 'onBlur',
  })

  const { formData, setFormData } = useLoadTherapistData(methods)

  const [activeTab, setActiveTab] = useState<Tab>('Basics')
  const currentIndex = TABS.indexOf(activeTab)
  const isLast = currentIndex === TABS.length - 1

  const previewUrl = formData.slug
    ? `/therapists/${formData.slug}?preview=true`
    : formData.id
    ? `/therapists/${formData.id}?preview=true`
    : '#'

  const onSubmit = async (data: FormData) => {
    if (!formData.id) {
      alert('Still loading your profile, please wait a moment.')
      return
    }

    try {
      const res = await fetch('/api/therapists/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        let message = 'Unknown error'
        try {
          const err = await res.json()
          message = err?.error || message
        } catch {
          // empty body — fallback to default message
        }
        alert(`Failed to save profile: ${message}`)
        return
      }

      if (!isLast) {
        setActiveTab(TABS[currentIndex + 1])
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      alert('Failed to save profile: Network error')
      console.error('❌ Save error:', error)
    }
  }

  const handleNext = () => {
    methods.trigger().then(valid => {
      if (valid) methods.handleSubmit(onSubmit)()
    })
  }

  const handleUnpublish = async () => {
    if (!formData.slug) return
    await fetch(`/api/therapists/${formData.slug}/publish`, { method: 'DELETE' })
    setFormData(prev => ({ ...prev, published: false }))
  }

  if (!formData.id) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading your profile…
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <>
        <BuildProfileHeader
          formData={formData}
          setFormData={setFormData}
          onUnpublish={handleUnpublish}
          previewUrl={previewUrl}
        />

        <div className="max-w-4xl mx-auto py-8">
          <StepTabs
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <WizardFormBody activeTab={activeTab} />
          <StepFooter
            step={currentIndex + 1}
            tabs={TABS}
            isSaving={false}
            back={() => setActiveTab(TABS[currentIndex - 1])}
            next={handleNext}
          />
        </div>
      </>
    </FormProvider>
  )
}
