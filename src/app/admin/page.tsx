'use client'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf9] text-[#1a2d3e]">
      <h1 className="text-2xl font-semibold mb-10">ADMIN</h1>
      <div className="flex gap-16">
        <AdminCard title="Blog" basePath="/admin/blog" />
        <AdminCard title="Worksheets" basePath="/admin/worksheets" />
      </div>
    </main>
  )
}

function AdminCard({ title, basePath }: { title: string; basePath: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-xl font-medium mb-4">
        {title}
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Link href={`${basePath}/list`} className="text-black hover:underline">
          View list
        </Link>
        <Link href={`${basePath}/new`} className="text-black hover:underline">
          New
        </Link>
      </div>
    </div>
  )
}
