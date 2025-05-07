/* ── src/app/register/page.tsx ───────────────────────────────────────── */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res  = await fetch('/api/register', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ email, password })   // ← no claimId here
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')

      // new blank therapist record is generated in the API route
      localStorage.setItem('therapistId', data.user.therapistId)
      router.push('/build-profile')
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFBFA] flex items-start justify-center px-4 pt-16 pb-32 sm:pt-24">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-10">
        {/* Title */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Get listed</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register a new therapist account.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f1f5f9] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Create password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f1f5f9] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 transition text-white font-semibold py-3 rounded-full disabled:opacity-50"
          >
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-teal-700 font-medium hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  )
}
