

// src/app/therapists/page.tsx
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma'; // Your Prisma client
import TherapistList from '@/components/TherapistList/TherapistList'; // CORRECTED AND ONLY LINE FOR THIS
import { TherapistDataForCard } from '@/components/TherapistList/TherapistCard'; // CORRECTED AND ONLY LINE FOR THIS

const PAGE_SIZE = 10;

// ... rest of the file
// Type for items returned from the AI ranking API
interface RankedItem {
  id: string;
  reason: string;
  score: number;
}

// This is the type of object selected from Prisma
// It MUST provide all fields required by TherapistDataForCard
type TherapistFromDB = TherapistDataForCard & {
  // Add any fields here that are selected from DB but NOT directly used by TherapistCard,
  // but ARE used for filtering or sending to the AI API.
  // For example, if AI needs 'personalStatement1' but TherapistCard only shows 'tagline' as primary bio.
  // Based on current TherapistCard, TherapistDataForCard should be sufficient.
  // Ensure all fields for AI are included in TherapistDataForCard if they are also for the card.
  personalStatement1?: string | null; // Example: if AI uses this but card uses tagline.
  telehealth?: boolean | null;        // Needed for AI and potentially filters
  // If 'feeIndividual' from DB is number, but 'TherapistDataForCard' expects string, transform it.
  // For now, assuming seed makes them strings, so direct match.
};


export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const title = zip
    ? `Find Licensed Therapists Near ${zip} | TherapistDB`
    : 'Your Trusted Directory for Mental Health Support | TherapistDB';
  const description = zip
    ? `Browse licensed, verified therapists in ${zip}. In-person or online sessions available near you.`
    : 'Connect with licensed therapists, counselors, and psychologists for in-person or online sessions.';
  const urlBase = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Fallback for local
  const canonicalUrl = new URL('/therapists', urlBase);
  if (zip) canonicalUrl.searchParams.set('zip', zip);
  // Add other stable search params to canonical if desired (e.g., a primary specialty)

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl.toString() },
    openGraph: {
      title,
      description,
      url: canonicalUrl.toString(),
      siteName: 'TherapistDB',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function TherapistsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  console.log("THERAPISTS_PAGE: Rendering. Search params:", searchParams);

  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const page = parseInt((searchParams.page as string) || '1', 10);
  const issue = typeof searchParams.issue === 'string' && searchParams.issue.trim() !== "" ? searchParams.issue.trim() : undefined;

  // Construct where clause for Prisma
  const where: any = { published: true };
  if (zip) where.primaryZip = zip; // Use primaryZip based on seed
  if (searchParams.insurance) where.insuranceAccepted = { contains: searchParams.insurance as string, mode: 'insensitive' };
  if (searchParams.degree) where.primaryCredential = { contains: searchParams.degree as string, mode: 'insensitive' };
  if (searchParams.remote === 'Yes') where.telehealth = true;
  if (searchParams.price) {
    const priceStr = searchParams.price as string;
    // Assuming feeIndividual is stored as a string like "$XXX" or "XXX-YYY" from CSV
    // This makes direct numeric filtering hard. If they are numbers, use lt/gte.
    // For now, let's assume we might need to filter more loosely or improve data.
    // If feeIndividual is string like "100", "150", "Contact for fee"
    // A simple contains might work for "< $100" => "100" (if "100" is less than 100)
    // This part needs robust handling based on actual feeIndividual string format or converting it to numeric.
    // Example: if feeIndividual stores just numbers as strings:
    // const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    // if (priceStr.startsWith('<')) where.feeIndividualNumeric = { lt: priceNum };
    // else if (priceStr.includes('–')) { ... }
    // For now, skipping direct fee filtering due to complexity with string fees.
  }
  if (searchParams.age && Array.isArray(where.ages)) where.ages = { has: searchParams.age as string };
  else if (searchParams.age) where.ages = { has: searchParams.age as string };

  if (searchParams.condition && Array.isArray(where.issues)) where.issues = { has: searchParams.condition as string };
  else if (searchParams.condition) where.issues = { has: searchParams.condition as string };

  if (searchParams.language && Array.isArray(where.languages)) where.languages = { has: searchParams.language as string };
  else if (searchParams.language) where.languages = { has: searchParams.language as string };

  if (searchParams.faith && Array.isArray(where.communities)) where.communities = { has: searchParams.faith as string };
  else if (searchParams.faith) where.communities = { has: searchParams.faith as string };

  if (searchParams.treatmentStyle && Array.isArray(where.treatmentStyle)) where.treatmentStyle = { has: searchParams.treatmentStyle as string };
  else if (searchParams.treatmentStyle) where.treatmentStyle = { has: searchParams.treatmentStyle as string };


  const total = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page < 1 || (totalPages > 0 && page > totalPages && total > 0) ) { // Allow page 1 if total is 0
      console.warn(`THERAPISTS_PAGE: Page ${page} not found. Total therapists: ${total}, Total pages: ${totalPages}. Redirecting or showing notFound.`);
      notFound();
  }

  // SELECT THE CORRECT FIELDS BASED ON YOUR prisma.seed.ts and TherapistDataForCard
  const therapistsFromDB: TherapistFromDB[] = await prisma.therapist.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,        // Corrected
      primaryCredential: true,
      primaryCredentialAlt: true,
      tagline: true,
      feeIndividual: true,   // String from seed
      feeCouples: true,      // String from seed
      slidingScale: true,
      paymentMethods: true,
      insuranceAccepted: true, // String from seed
      primaryCity: true,     // Corrected
      primaryState: true,    // Corrected
      primaryZip: true,      // Corrected
      telehealth: true,
      issues: true,          // Corrected (Clients Concerns I treat)
      languages: true,
      treatmentStyle: true,  // Corrected (Types of Therapy)
      personalStatement1: true, // For AI, if different from tagline
      // Add any other fields needed by TherapistCard or for AI ranking
    },
    orderBy: { name: 'asc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  console.log(`THERAPISTS_PAGE: Fetched ${therapistsFromDB.length} therapists from DB.`);

  let displayedTherapists: TherapistDataForCard[] = therapistsFromDB.map(t => ({...t})); // Shallow copy for safety
  let reasonMap = new Map<string, string>();
  let aiError: string | null = null;

  if (issue && therapistsFromDB.length > 0) {
    console.log(`THERAPISTS_PAGE: Issue "${issue}" present. Attempting AI ranking for ${therapistsFromDB.length} therapists.`);
    try {
      // Prepare data for the AI ranking API call.
      // Ensure fields match what `rank-therapists/route.ts` expects in its `listBlock`.
      const therapistsForRankingAPI = therapistsFromDB.map(t => ({
        id: t.id,
        name: t.name,
        // Use 'issues' for AI as it's the primary field for concerns
        specialties: t.issues, // Map 'issues' from DB to 'specialties' for AI prompt if preferred
        languages: t.languages,
        insuranceAccepted: t.insuranceAccepted,
        feeIndividual: t.feeIndividual, // Pass as string
        primaryCity: t.primaryCity,
        primaryState: t.primaryState,
        primaryZip: t.primaryZip, // Or seoZip1 if it's more relevant for AI context
        treatmentStyle: t.treatmentStyle,
        // Use personalStatement1 for a more detailed bio for AI if tagline is too short
        bio: t.personalStatement1 || t.tagline,
        telehealth: t.telehealth,
      }));

      const rankingApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rank-therapists`;
      console.log("THERAPISTS_PAGE: Calling AI ranking API:", rankingApiUrl);

      const res = await fetch(rankingApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue, therapists: therapistsForRankingAPI }),
        cache: 'no-store',
      });

      console.log(`THERAPISTS_PAGE: AI ranking API call completed with status ${res.status}.`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `API request failed with status ${res.status}` }));
        aiError = errorData.error || `AI ranking service returned status ${res.status}.`;
        console.error("THERAPISTS_PAGE: AI ranking API error -", aiError);
      } else {
        const { ranked, error: apiReturnedError } = (await res.json()) as { ranked?: RankedItem[], error?: string };
        if (apiReturnedError) {
            aiError = apiReturnedError;
            console.error("THERAPISTS_PAGE: AI ranking API returned an error property:", apiReturnedError);
        } else if (ranked && Array.isArray(ranked)) {
            console.log(`THERAPISTS_PAGE: Received ${ranked.length} ranked items from API.`);
            reasonMap = new Map(ranked.map((r: RankedItem) => [r.id, r.reason]));
            displayedTherapists = ranked
              .map((rankedItem: RankedItem) => therapistsFromDB.find(t => t.id === rankedItem.id))
              .filter((t): t is TherapistDataForCard => Boolean(t)); // Ensure correct type and filter out undefined
            // Add unranked therapists to the end
            therapistsFromDB.forEach(dbT => {
                if (!displayedTherapists.find(dispT => dispT.id === dbT.id)) {
                    displayedTherapists.push(dbT);
                }
            });
        } else {
            aiError = 'AI ranking API returned unexpected data format.';
            console.error("THERAPISTS_PAGE:", aiError);
        }
      }
    } catch (err: any) {
      aiError = `Failed to connect to AI ranking service: ${err.message}`;
      console.error("THERAPISTS_PAGE: Network error fetching AI ranking:", err.message, err.stack);
    }
  }

  // Prepare searchParamsObject for TherapistList (used by Pagination)
  // Exclude 'page' as Pagination handles it.
  const searchParamsObjectForList: { [key: string]: string | undefined } = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== 'page' && typeof value === 'string') {
      searchParamsObjectForList[key] = value;
    }
    // Note: if you have array search params, this simple conversion might not be enough.
    // Next.js searchParams can have string[] for multiple values with same key.
  }


  return (
    <main className="bg-slate-50 min-h-screen px-4 py-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {zip
              ? `Find Licensed Therapists Near ${zip}`
              : 'Your Trusted Directory for Mental Health Support'}
          </h1>
          <p className="text-md sm:text-lg text-gray-600 max-w-3xl mx-auto mt-3">
            Whether you’re managing anxiety, healing from trauma, or just need someone to talk to,
            TherapistDB connects you with licensed, verified mental health professionals.
          </p>
        </header>

        <TherapistList
          therapists={displayedTherapists}
          reasonMap={reasonMap}
          aiError={aiError}
          totalTherapistsCount={total}
          totalPages={totalPages}
          currentPage={page}
          searchParamsObject={searchParamsObjectForList}
          currentZip={zip}
          currentIssue={issue}
        />
      </div>
    </main>
  );
}