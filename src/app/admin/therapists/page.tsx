import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function TherapistListPage() {
  const therapists = await prisma.therapist.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">All Therapists</h1>
      <ul className="space-y-4">
        {therapists.map((t) => (
          <li key={t.id} className="border p-4 rounded bg-white/5">
            <Link
              href={`/therapists/${t.slug}`}
              className="font-semibold text-blue-400 hover:underline"
            >
              {t.name}
            </Link>
            <div className="text-sm text-gray-400">{t.city || 'Unknown'}, {t.state || '—'}</div>
            <div className="text-sm">Specialties: {t.professions || '—'}</div>
            <div className="text-sm">Slug: <code>{t.slug || '—'}</code></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
