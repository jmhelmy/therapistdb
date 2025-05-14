export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientFilters from '@/components/ClientFilters';
import TherapistCard from '@/components/TherapistCard';
import Pagination from '@/components/Pagination';
import ZipSearchForm from '@/components/ZipSearchForm';
import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';

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

  // Build filter
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

  // Optional AI ranking
  let reasonMap = new Map<string, string>();
  if (issue) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const listBlock = therapists
      .map(t => `
ID: ${t.id}
Name: ${t.name}
Specialties: ${(t.issues || []).join(', ')}
Languages: ${(t.languages || []).join(', ')}
Insurance: ${t.insuranceAccepted || 'N/A'}
Fees: ${t.feeIndividual || 'N/A'}
Location: ${[t.primaryCity, t.primaryState, t.primaryZip].filter(Boolean).join(', ')}
Modalities: ${(t.treatmentStyle || []).join(', ')}
`.trim())
      .join('\n\n');

    const prompt = `
You are an assistant matching a user with a therapist based on this user issue:
"${issue}"

Below are full profiles of the candidate therapists. Rank them from best fit to least, and for each therapist give a one-sentence reason why they’re a good (or poor) match.

${listBlock}

Respond only with a JSON array of objects like:
[
  { "id": "therapist-id-1", "reason": "They specialize in X and offer sliding-scale." },
  { "id": "therapist-id-2", "reason": "…" }
]
`.trim();

    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    try {
      const ranked = JSON.parse(res.choices[0].message.content) as { id: string; reason: string }[];
      reasonMap = new Map(ranked.map(r => [r.id, r.reason]));
      therapists = ranked
        .map(r => therapists.find(t => t.id === r.id))
        .filter((t): t is typeof therapists[number] => Boolean(t));
    } catch {
      console.warn('Could not parse ranking:', res.choices[0].message.content);
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

        {/* ZIP search pulled into its own component */}
        <ZipSearchForm />

        {/* other filters */}
        <ClientFilters />

        {/* issue textarea stays here for AI ranking */}
        <form method="get" className="mt-6 mb-4">
          <textarea
            name="issue"
            defaultValue={issue}
            rows={4}
            placeholder="Describe your issue here (e.g., anxiety, relationship struggles)..."
            className="w-full p-4 border border-gray-300 rounded-lg"
          />
          {zip && <input type="hidden" name="zip" value={zip} />}
          <input type="hidden" name="page" value={page} />
          <button type="submit" className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg">
            Search by Issue
          </button>
        </form>

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
