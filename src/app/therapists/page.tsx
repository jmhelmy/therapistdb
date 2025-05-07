// src/app/therapists/page.tsx
import ClientFilters from '@/components/ClientFilters'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

/* 1. Dynamic <head> metadata */
export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const zip = searchParams.zip
  return {
    title: zip
      ? `Therapists near ${zip} | TherapistDB`
      : 'Find a Therapist | TherapistDB',
    description: zip
      ? `Browse licensed mental-health professionals near zip code ${zip}.`
      : 'Browse licensed therapists and counselors to find the right mental-health support for you.',
  }
}

/* 2. Page component (server) */
export default async function TherapistsPage({ searchParams }: any) {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined

  const where = {
    published: true,
    slug:      { not: '' },
    ...(zip && { zipCode: zip }),
  } as const

  const therapists = await prisma.therapist.findMany({
    where,
    orderBy: { name: 'asc' },
    take: 50,
  })

  return (
    <main className="bg-[#F9FAF9] min-h-screen px-4 py-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Page title */}
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          {zip ? `Therapists near ${zip}` : 'Find a Mental Health Professional'}
        </h1>

        {/* 3. Client-side filters */}
        <ClientFilters />

        {/* 4. Therapist listings or empty state */}
        <section aria-labelledby="therapist-list-heading" className="mt-8">
          <h2 id="therapist-list-heading" className="sr-only">
            {therapists.length
              ? `Listing of therapists${zip ? ` near ${zip}` : ''}`
              : 'No therapists found'}
          </h2>

          {therapists.length === 0 ? (
            <p className="text-center text-gray-500">
              {zip
                ? `No published therapists found for zip code “${zip}”.`
                : 'No published therapists available at the moment.'}
            </p>
          ) : (
            <ul className="space-y-6">
              {therapists.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/therapists/${t.slug}`}
                    className="block hover:shadow-md transition-shadow duration-200 rounded-xl"
                  >
                    <div className="bg-white rounded-xl shadow-md p-6 flex gap-5 items-start border border-gray-100">
                      {/* Avatar */}
                      <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
                        <Image
                          src={t.imageUrl ?? '/default-avatar.png'}
                          alt={`${t.name ?? 'Therapist'} avatar`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#181818]">
                          {t.name ?? 'Unnamed Therapist'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {(t.professions as string) ?? 'N/A'} —{' '}
                          {t.city ?? 'Unknown City'}, {t.state ?? 'Unknown State'}
                        </p>
                        <p className="text-sm text-gray-800 mb-2 leading-relaxed">
                          {t.description ?? ''}
                        </p>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p>
                            <strong>Billing:</strong> {t.billing ?? 'N/A'}
                          </p>
                          <p>
                            <strong>Languages:</strong>{' '}
                            {Array.isArray(t.languages) && t.languages.length
                              ? t.languages.join(', ')
                              : 'N/A'}
                          </p>
                          <p>
                            <strong>Concerns:</strong>{' '}
                            {Array.isArray(t.clientConcerns) && t.clientConcerns.length
                              ? t.clientConcerns.join(', ')
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
