'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ProfileHeaderProps {
  published: boolean
  isSaving: boolean
  onPublish: () => Promise<void>
  onUnpublish: () => Promise<void>
}

export default function ProfileHeader({
  published,
  isSaving,
  onPublish,
  onUnpublish,
}: ProfileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-xl">
      <div className="flex items-center space-x-3">
        {/* Profile icon linking to account page */}
        <Link href="/account">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H3z" />
            </svg>
          </div>
        </Link>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>

      {/* Publish button or overflow menu */}
      {!published ? (
        <button
          onClick={onPublish}
          disabled={isSaving}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full disabled:opacity-50"
        >
          {isSaving ? 'Publishing…' : 'Publish to public'}
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 10a2 2 0 114.001-.001A2 2 0 016 10zm4 0a2 2 0 114.001-.001A2 2 0 0110 10zM2 10a2 2 0 114.001-.001A2 2 0 012 10z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
              <button
                onClick={async () => {
                  await onUnpublish()
                  setMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Hide profile from public
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
