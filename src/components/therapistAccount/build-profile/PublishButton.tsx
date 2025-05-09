'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface PublishButtonProps {
  formData: {
    id?: string
    name?: string
    published?: boolean
    slug?: string
  }
  setFormData: (updater: (prev: any) => any) => void
}

export default function PublishButton({
  formData,
  setFormData,
}: PublishButtonProps) {
  const [loading, setLoading] = useState(false)
  const methods = useFormContext()

  const handlePublish = async () => {
    if (!formData.id || !formData.name?.trim()) {
      alert('Therapist must have an ID and a name before publishing.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/therapists/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        alert(`Publish failed: ${json.message || 'Unknown error'}`)
        return
      }

      const updatedSlug = json.slug || formData.slug
      console.log('✅ Published with slug:', updatedSlug)

      // ✅ Update both react-hook-form and local formData
      methods.setValue('published', true)
      methods.setValue('slug', updatedSlug)

      setFormData(prev => ({
        ...prev,
        published: true,
        slug: updatedSlug,
      }))
    } catch (err) {
      console.error('❌ Publish error:', err)
      alert('An error occurred while publishing.')
    } finally {
      setLoading(false)
    }
  }

  if (formData.published) return null

  return (
    <button
      onClick={handlePublish}
      disabled={!formData.id || !formData.name?.trim() || loading}
      className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition disabled:opacity-50"
    >
      {loading ? 'Publishing…' : 'Publish'}
    </button>
  )
}
