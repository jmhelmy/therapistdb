// src/components/build-profile/BuildProfileHeader.tsx
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MoreVertical, User } from 'lucide-react'
import PublishButton from './PublishButton'

type Props = {
  formData: { id?: string; name?: string; published?: boolean }
  setFormData: (f: (prev: any) => any) => void
  onUnpublish: () => void
  previewUrl: string
}

export default function BuildProfileHeader({
  formData,
  setFormData,
  onUnpublish,
  previewUrl,
}: Props) {
  const { data: session } = useSession()

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <Link href="/account">
        <User className="w-6 h-6 text-gray-700 hover:text-gray-900" />
      </Link>

      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-teal-700">Edit Profile</h1>
        <Link href={previewUrl} target="_blank">
          <span className="text-sm text-gray-600 hover:underline">Preview</span>
        </Link>
      </div>

      <div className="relative">
        <PublishButton formData={formData} setFormData={setFormData} />
        {formData.published && (
          <details className="relative inline-block ml-2">
            <summary className="cursor-pointer p-2 rounded hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </summary>
            <ul className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <li>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={onUnpublish}
                >
                  Unpublish
                </button>
              </li>
            </ul>
          </details>
        )}
      </div>
    </header>
  )
}
