// app/admin/worksheets/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '@/app/admin/worksheets/new/editor.css'

export default function NewWorksheetPage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [pdf, setPdf] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('description', description)
    formData.append('markdown', editor?.getHTML() || '')
    if (image) formData.append('image', image)
    if (pdf) formData.append('pdf', pdf)

    const res = await fetch('/api/worksheets/upload', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      router.push('/worksheets/' + slug)
    } else {
      alert('Upload failed. Check console for error.')
      console.error(await res.text())
    }

    setSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">New Worksheet Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Slug (no spaces)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Short Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Upload Preview Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Worksheet Content</label>
          <div className="border border-gray-300 bg-white rounded p-2 min-h-[200px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
        >
          {submitting ? 'Uploading...' : 'Upload Worksheet'}
        </button>
      </form>
    </div>
  )
}
