'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function ClaimPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // UI state
  const [therapistName, setTherapistName] = useState<string | null>(null)
  const [email, setEmail]                 = useState('')
  const [password, setPassword]           = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)

  // Load the therapist’s name for display
  useEffect(() => {
    if (!id) return
    fetch(`/api/therapists/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load profile')
        return r.json()
      })
      .then(data => setTherapistName(data.name ?? null))
      .catch(() => setTherapistName(null))
  }, [id])

  // Handle the “Claim and continue” form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1) Register, passing the claimId so your backend can attach userId to that therapist
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, claimId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Claim failed')

      // 2) Immediately sign in with credentials
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.error) throw new Error(result.error)

      // 3) Redirect to the build-profile flow
      router.push('/build-profile')
    } catch (err: any) {
      console.error('Claim error:', err)
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFBFA] flex items-start justify-center py-24 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl px-10 py-12">
        <h1 className="text-2xl font-extrabold text-center mb-2">Claim Profile</h1>
        <h2 className="text-3xl font-black text-center text-gray-900 mb-8 leading-tight">
          {therapistName ?? '…'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#f1f5f9] rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Create Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#f1f5f9] rounded-md border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 transition
                       text-white font-semibold px-6 py-3 rounded-full
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Claiming…' : 'Claim and continue'}
          </button>
        </form>
      </div>
    </main>
  )
}
