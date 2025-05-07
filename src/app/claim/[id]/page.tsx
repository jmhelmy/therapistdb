/* -------------------------------------------------------------------------- */
/*  src/app/claim/[id]/page.tsx                                               */
/* -------------------------------------------------------------------------- */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ClaimPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  /* ---------------------------------------------------------------------- */
  /* local state                                                            */
  /* ---------------------------------------------------------------------- */
  const [therapist, setTherapist] = useState<{ name?: string } | null>(null);
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* fetch the therapist’s name once                                         */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/therapists/${id}`)
      .then(res => res.json())
      .then(setTherapist)
      .catch(() => setTherapist({ name: undefined }));   // still render page
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* submit handler                                                          */
  /* ---------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch('/api/register', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ email, password, claimId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      /* stash id so /build-profile opens the claimed record  */
      localStorage.setItem('therapistId', data.user.therapistId);
      router.push('/build-profile');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */
  return (
    <main className="min-h-screen bg-[#FAFBFA] flex items-start justify-center py-24 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl px-10 py-12">
        {/* Page title */}
        <h1 className="text-2xl font-extrabold text-center mb-2">Claim profile</h1>

        {/* Therapist name (or fallback while loading) */}
        <h2 className="text-3xl font-black text-center text-gray-900 mb-8 leading-tight">
          {therapist?.name ? therapist.name : '…'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
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
            <label className="block text-sm font-medium mb-1 text-gray-700">Create Password</label>
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
            {loading ? 'Registering…' : 'Claim and continue'}
          </button>
        </form>

        {/* Secondary link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          <button
            type="button"
            className="underline hover:text-gray-800"
            onClick={() => alert('We will add a removal workflow soon.')}
          >
            Ask to remove profile
          </button>
        </p>
      </div>
    </main>
  );
}
