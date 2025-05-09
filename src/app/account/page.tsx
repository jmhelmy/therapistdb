'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AccountPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  if (!session) {
    return <p>Loading...</p>
  }

  return (
    <div className="p-12 bg-gray-50 min-h-screen">
      <nav className="flex justify-between items-center border-b pb-4 mb-8">
        <Link href="/build-profile" className="text-teal-700 font-medium">
          Profile
        </Link>
        <h1 className="text-xl font-semibold">Account</h1>
        <button onClick={handleLogout} className="text-teal-700 font-medium">Logout</button>
      </nav>

      <div className="max-w-xl mx-auto bg-white rounded shadow p-8">
        <p className="font-semibold mb-1">Account email</p>
        <p className="mb-6">{session.user?.email}</p>

        <p className="font-semibold mb-1">Subscription</p>
        <p className="text-sm text-gray-600 mb-4">
          Get more leads by allowing users to email you<br />
          Allow prospective clients to email you for $10/month
        </p>

        <div className="bg-purple-100 text-purple-800 p-4 rounded flex items-center mb-4">
          <span className="mr-2">⚠️</span> Not subscribed
        </div>

        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
          Subscribe for more leads
        </button>

        <div className="mt-8 space-y-2 text-blue-700 text-sm">
          <a href="/account/change-email">Change email</a><br />
          <a href="/account/change-password">Change password</a><br />
          <a href="/account/delete-profile">Delete profile</a>
        </div>
      </div>
    </div>
  )
}
