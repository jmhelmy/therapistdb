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
    ? `Find Licensed Therapists Near ${zip} | TherapistDB`
    : 'Your Trusted Directory for Mental Health Support | TherapistDB';
  const description = zip
    ? `Browse licensed, verified therapists in ${zip}. In-person or online sessions available near you.`
    : 'Connect with licensed therapists, counselors, and psychologists for in-person or online sessions.';
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

  // JSON-LD for therapist list
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: therapists.map((t, i) => ({
      '@type': 'ListItem',
      position: (page - 1) * PAGE_SIZE + i + 1,
      url: `https://yourdomain.com/therapists/${t.slug}`
    }))
  };

  // JSON-LD for FAQs
  const faqJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find a licensed therapist near me?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our location filter to search by zip code and specialty—then browse therapist profiles with verified credentials.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I book online therapy through TherapistDB?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes—many of our listed clinicians offer secure telehealth sessions via video or phone.'
        }
      }
    ]
  };

  return (
    <>
      {/* Structured data for list and FAQs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />

      <main className="bg-[#F9FAF9] min-h-screen px-4 py-12 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Title & Intro */}
          <h1 className="text-4xl font-bold text-center text-gray-800">
            {zip
              ? `Find Licensed Therapists Near ${zip}`
              : 'Your Trusted Directory for Mental Health Support'}
          </h1>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mt-4">
            Whether you’re managing anxiety, healing from trauma, or just need someone to talk to,
            TherapistDB connects you with licensed, verified mental health professionals ready to help.
          </p>
          <p className="text-md text-center text-gray-600 max-w-2xl mx-auto">
            Browse psychologists, clinical social workers, marriage and family therapists, and more—offering both in-person and online sessions.
          </p>

          {/* Filters */}
          <ClientFilters />

          {/* Results Count */}
          <div className="text-gray-600 text-center">
            Showing {total.toLocaleString()} result{total !== 1 && 's'}
            {zip && ` near ${zip}`}
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
            className="flex items-center justify-center space-x-2 mt-8"
            aria-label="Pagination"
          >
            <Link
              href={`?zip=${zip || ''}&page=${page - 1}`}
              className={`p-2 rounded ${
                page === 1
                  ? 'text-gray-400 pointer-events-none'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              rel="prev"
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
              rel="next"
            >
              →
            </Link>
          </nav>
        </div>
      </main>
    </>
  );
}
