'use client'

import { useEffect } from 'react'
import { useWatch, UseFormReturn } from 'react-hook-form'
import { FormData } from '../ProfileWizard'

export default function useLoadTherapistData(methods: UseFormReturn<FormData>) {
  const formData = useWatch({ control: methods.control })

  const setFormData = (updater: (prev: FormData) => FormData) => {
    const updated = updater(formData)
    Object.entries(updated).forEach(([key, value]) => {
      methods.setValue(key as keyof FormData, value)
    })
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/therapists/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // 🔥 ensures cookie/session is sent
        })

        if (!res.ok) {
          console.warn('⚠️ Failed to fetch profile', res.status)
          return
        }

        const data = await res.json()

        if (!data.id) {
          console.warn('⚠️ Therapist loaded but missing ID')
          return
        }

        console.log('✅ Therapist loaded:', data)

        // 🧠 Set all fields you care about
        setFormData(() => ({
          id: data.id,
          name: data.name || '',
          slug: data.slug || '',
          published: data.published || false,
        }))
      } catch (err) {
        console.error('❌ Error loading profile:', err)
      }
    }

    load()
  }, [])

  return { formData, setFormData }
}
