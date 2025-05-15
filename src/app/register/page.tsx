// src/app/register/page.tsx (or your specific path)
'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image'; // For logo
import { Mail, Lock, Loader2, UserPlus } from 'lucide-react'; // Icons

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Optional: Add name field if you want to collect it at registration
  // const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) { // Basic client-side password length check
        setError("Password must be at least 8 characters long.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch('/api/register', { // Ensure this API endpoint exists and handles registration
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          // name: name.trim(), // If collecting name
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Use the error message from the API if available
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      // If registration is successful, attempt to sign in
      const signInRes = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false, // Handle redirect manually after successful sign-in
      });

      if (signInRes?.error) {
        // Handle sign-in specific errors, e.g., "CredentialsSignin"
        // It's possible registration succeeded but immediate sign-in failed for some reason
        setError(signInRes.error === 'CredentialsSignin' ? 'Invalid credentials after registration.' : signInRes.error);
        setLoading(false); // Stop loading as sign-in failed
        return; // Don't proceed to redirect
      }

      if (signInRes?.ok && !signInRes?.error) {
        // Successful sign-in, redirect to profile builder or dashboard
        window.location.href = '/build-profile'; // Or use Next.js router if preferred after sign-in
      } else {
        // Fallback if signInRes is not ok but also no specific error (shouldn't happen often)
        setError("Registration succeeded, but automatic login failed. Please try logging in manually.");
        setLoading(false);
      }

    } catch (err: any) {
      console.error('❌ Registration Process Error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logotherapistdb.png" // Ensure this path is correct
              alt="TherapistDB Logo"
              width={48} // Slightly larger logo
              height={48}
            />
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-8 sm:p-10">
          <header className="text-center mb-8">
            <UserPlus className="mx-auto text-teal-600 mb-3" size={36} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Create Your Therapist Account
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Join our community and start connecting with clients.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Optional: Name Field
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                  placeholder="Your Full Name"
                />
              </div>
            </div>
            */}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Create Password
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8} // Basic HTML5 validation
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                  placeholder="Minimum 8 characters"
                />
              </div>
               {/* Optional: Password strength indicator or requirements text */}
               <p className="mt-1.5 text-xs text-gray-500">Password must be at least 8 characters long.</p>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-700 transition text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registering…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          By creating an account, you agree to our <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}