// src/app/therapists/page.tsx
import ClientFilters from '@/components/ClientFilters'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

const PAGE_SIZE = 10

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined
  return {
    title: zip
      ? `Therapists near ${zip} | TherapistDB`
      : 'Find a Therapist | TherapistDB',
    description: zip
      ? `Browse licensed mental-health professionals near zip code ${zip}.`
      : 'Browse licensed therapists and counselors to find the right mental-health support for you.',
  }
}

export default async function TherapistsPage({ searchParams }: any) {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined
  const page = parseInt((searchParams.page as string) || '1', 10)

  // Build your Prisma filter
  const where: any = { published: true }
  if (zip) {
    // change this to whichever field you index for zip:
    where.seoZip1 = zip
  }

  const total = await prisma.therapist.count({ where })
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const therapists = await prisma.therapist.findMany({
    where,
    orderBy: { name: 'asc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  })

  return (
    <main className="bg-[#F9FAF9] min-h-screen px-4 py-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          {zip ? `Therapists near ${zip}` : 'Find a Mental Health Professional'}
        </h1>

        {/* Only this search/filter bar */}
        <ClientFilters />

        {/* Results Count */}
        <div className="text-gray-600">
          {total.toLocaleString()} Results
        </div>

        {/* Therapist Cards */}
        <ul className="space-y-6">
          {therapists.map((t) => (
            <li key={t.id}>
              <Link
                href={`/therapists/${t.slug}`}
                className="block hover:shadow-md transition-shadow duration-200 rounded-xl"
              >
                <div className="bg-white rounded-xl shadow-md p-6 flex gap-5 items-start border border-gray-100">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                    <Image
                      src={t.imageUrl || '/default-avatar.png'}
                      alt={`${t.name} avatar`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {t.primaryCredential}
                      {t.primaryCredentialAlt && `, ${t.primaryCredentialAlt}`}
                    </p>
                    {t.tagline && (
                      <p className="text-sm text-gray-800 mb-2">{t.tagline}</p>
                    )}

                    <div className="text-sm text-gray-700 space-y-1 mb-2">
                      <p>
                        <strong>Individual Fee:</strong>{' '}
                        {t.feeIndividual || 'N/A'}
                      </p>
                      <p>
                        <strong>Couples Fee:</strong>{' '}
                        {t.feeCouples || 'N/A'}
                      </p>
                      {t.slidingScale && (
                        <p className="text-green-700">✅ Sliding Scale</p>
                      )}
                    </div>

                    <div className="text-sm text-gray-700 space-y-1 mb-2">
                      <p>
                        <strong>Payment Methods:</strong>{' '}
                        {t.paymentMethods.length
                          ? t.paymentMethods.join(', ')
                          : 'N/A'}
                      </p>
                      <p>
                        <strong>Insurance:</strong>{' '}
                        {t.insuranceAccepted || 'N/A'}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Location:</strong>{' '}
                      {t.primaryCity || '—'},{' '}
                      {t.primaryState || '—'} {t.primaryZip || ''}
                    </p>

                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Languages:</strong>{' '}
                        {t.languages.length
                          ? t.languages.join(', ')
                          : 'N/A'}
                      </p>
                      <p>
                        <strong>Issues:</strong>{' '}
                        {t.issues.length ? t.issues.join(', ') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <nav
          className="flex items-center justify-center space-x-2"
          aria-label="Pagination"
        >
          <Link
            href={`?zip=${zip || ''}&page=${page - 1}`}
            className={`p-2 rounded ${
              page === 1
                ? 'text-gray-400 pointer-events-none'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            ←
          </Link>
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`?zip=${zip || ''}&page=${i + 1}`}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </Link>
          ))}
          <Link
            href={`?zip=${zip || ''}&page=${page + 1}`}
            className={`p-2 rounded ${
              page === totalPages
                ? 'text-gray-400 pointer-events-none'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            →
          </Link>
        </nav>
      </div>
    </main>
  )
}
