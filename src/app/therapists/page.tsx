export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientFilters from '@/components/ClientFilters';
import TherapistCard from '@/components/TherapistCard';
import Pagination from '@/components/Pagination';
import IssueForm from '@/components/IssueForm';
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
    alternates: { canonical: zip ? `${urlBase}?zip=${zip}` : urlBase },
    openGraph: {
      title,
      description,
      url: zip ? `${urlBase}?zip=${zip}` : urlBase,
      siteName: 'TherapistDB',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function TherapistsPage({ searchParams }: any) {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const page = parseInt((searchParams.page as string) || '1', 10);
  const issue = typeof searchParams.issue === 'string' ? searchParams.issue : undefined;

  const where: any = { published: true };
  if (zip) where.seoZip1 = zip;
  if (searchParams.insurance) where.insuranceAccepted = searchParams.insurance;
  if (searchParams.degree) where.primaryCredential = searchParams.degree;
  if (searchParams.remote === 'Yes') where.telehealth = true;
  if (searchParams.price) {
    where.feeIndividual =
      searchParams.price === '< $100'
        ? { lt: 100 }
        : searchParams.price === '$100–150'
        ? { gte: 100, lte: 150 }
        : searchParams.price === '$150+'
        ? { gt: 150 }
        : undefined;
  }
  if (searchParams.age) where.ages = { has: searchParams.age };
  if (searchParams.condition) where.issues = { has: searchParams.condition };
  if (searchParams.language) where.languages = { has: searchParams.language };
  if (searchParams.faith) where.communities = { has: searchParams.faith };
  if (searchParams.treatmentStyle) where.treatmentStyle = { has: searchParams.treatmentStyle };

  const total = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (page < 1 || page > totalPages) notFound();

  let therapists = await prisma.therapist.findMany({
    where,
    orderBy: { name: 'asc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // AI RANKING via API (fixed for Vercel)
  let reasonMap = new Map<string, string>();
  if (issue && therapists.length > 0) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/rank-therapists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue, therapists }),
        cache: 'no-store',
      });

      const { ranked } = await res.json();
      reasonMap = new Map(ranked.map((r: any) => [r.id, r.reason]));
      therapists = ranked
        .map((r: any) => therapists.find((t: any) => t.id === r.id))
        .filter((t: any): t is typeof therapists[number] => Boolean(t));
    } catch (err) {
      console.error('Failed to fetch AI ranking:', err);
    }
  }

  return (
    <main className="bg-[#F9FAF9] min-h-screen px-4 py-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          {zip
            ? `Find Licensed Therapists Near ${zip}`
            : 'Your Trusted Directory for Mental Health Support'}
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mt-4">
          Whether you’re managing anxiety, healing from trauma, or just need someone to talk to,
          TherapistDB connects you with licensed, verified mental health professionals ready to help.
        </p>

        <ClientFilters />
        <IssueForm zip={zip} page={page} />

        <div className="text-gray-600 text-center">
          Showing {total.toLocaleString()} result{total !== 1 && 's'}
          {zip && ` near ${zip}`}
        </div>

        <ul className="space-y-6">
          {therapists.map(t => (
            <li key={t.id}>
              <TherapistCard therapist={t} />
              {reasonMap.has(t.id) && (
                <div className="mt-2 p-4 bg-teal-50 rounded">{reasonMap.get(t.id)}</div>
              )}
            </li>
          ))}
        </ul>

        <Pagination
          totalPages={totalPages}
          currentPage={page}
          basePath="/therapists"
          query={{ zip, issue }}
        />
      </div>
    </main>
  );
}
