'use client'

import { useState } from 'react'

const initialForm = {
  name: '',
  slug: '',
  imageUrl: '',
  city: '',
  state: '',
  contactInfo: '',
  licenseStatus: '',
  primaryCredential: '',
  description: '',
  professions: '',
  billing: '',
  offices: '',
  services: '',
  ages: '',
  languages: '',
  groups: '',
  communities: '',
  clientConcerns: '',
  typesOfTherapy: '',
}

export default function NewTherapistPage() {
  const [form, setForm] = useState(initialForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/therapists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Therapist saved!')
      setForm(initialForm)
    } else {
      alert('Error saving therapist')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 space-y-4">
      {Object.keys(form).map((key) => (
        <div key={key}>
          <label className="block font-semibold capitalize">{key}</label>
          {key === 'description' ? (
            <textarea
              name={key}
              value={form[key as keyof typeof form]}
              onChange={handleChange}
              rows={4}
              className="border p-2 w-full"
            />
          ) : (
            <input
              type="text"
              name={key}
              value={form[key as keyof typeof form]}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Therapist
      </button>
    </form>
  )
}
