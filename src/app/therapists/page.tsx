// Force this page to be rendered at request time instead of prerendered
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClientFilters from '@/components/ClientFilters';
import TherapistCard from '@/components/TherapistCard';
import { prisma } from '@/lib/prisma';

const PAGE_SIZE = 10;

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const title = zip
    ? `Therapists near ${zip} | TherapistDB`
    : 'Find a Therapist | TherapistDB';
  const description = zip
    ? `Browse licensed mental-health professionals near zip code ${zip}.`
    : 'Browse licensed therapists and counselors to find the right mental-health support for you.';
  const urlBase = 'https://yourdomain.com/therapists';

  return {
    title,
    description,
    alternates: {
      canonical: zip ? `${urlBase}?zip=${zip}` : urlBase
    },
    openGraph: {
      title,
      description,
      url: zip ? `${urlBase}?zip=${zip}` : urlBase,
      siteName: 'TherapistDB',
      locale: 'en_US',
      type: 'website'
    }
  };
}

export default async function TherapistsPage({ searchParams }: any) {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const page = parseInt((searchParams.page as string) || '1', 10);

  // Build Prisma filter
  const where: any = { published: true };
  if (zip) where.seoZip1 = zip;

  const total = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (page < 1 || page > totalPages) notFound();

  const therapists = await prisma.therapist.findMany({
    where,
    orderBy: { name: 'asc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE
  });

  // JSON-LD for SEO: list of therapist URLs
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: therapists.map((t, i) => ({
      '@type': 'ListItem',
      position: (page - 1) * PAGE_SIZE + i + 1,
      url: `https://yourdomain.com/therapists/${t.slug}`
    }))
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      <main className="bg-[#F9FAF9] min-h-screen px-4 py-12 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            {zip
              ? `Therapists near ${zip}`
              : 'Find a Mental Health Professional'}
          </h1>

          {/* Search / Filter */}
          <ClientFilters />

          {/* Results Count */}
          <div className="text-gray-600">
            {total.toLocaleString()} Results
          </div>

          {/* Therapist Cards */}
          <ul className="space-y-6">
            {therapists.map((t) => (
              <li key={t.id}>
                <TherapistCard therapist={t} />
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
    </>
  );
}
