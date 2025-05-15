// src/app/therapists/page.tsx
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TherapistList from '@/components/TherapistList/TherapistList';
import { TherapistDataForCard } from '@/components/TherapistList/TherapistCard';
import { formatSlugForDisplay, capitalize } from '@/utils/formatting'; // Ensure this utility file exists

const PAGE_SIZE = 10;

interface RankedItem { id: string; reason: string; score: number; }

// Define the comprehensive type for data selected from Prisma
// This should include all fields needed for display, AI ranking, and any other logic on this page.
type TherapistFromDB = TherapistDataForCard & {
  personalStatement1?: string | null;
  treatmentStyle?: string[] | null; // For AI ranking
  // Add other fields if your AI ranking uses them, e.g., more bio parts, specific experiences
  // Ensure TherapistDataForCard contains all fields needed by TherapistCard.tsx
};

// Predefined blurbs for SEO content - these could come from a CMS or DB later
const SEO_BLURBS: Record<string, { title: string, description: string, content?: string }> = {
  'depression': {
    title: "Find Therapists Specializing in Depression",
    description: "Connect with compassionate therapists offering support and treatment for depression. Explore effective strategies to manage symptoms and improve your well-being.",
    content: "Depression can feel overwhelming, but you don't have to go through it alone. Our directory features therapists experienced in evidence-based approaches like CBT, DBT, and psychodynamic therapy to help you understand and navigate your feelings, develop coping mechanisms, and work towards a more fulfilling life. Finding the right therapist is a crucial step towards healing."
  },
  'anxiety-stress': {
    title: "Therapists for Anxiety & Stress Management",
    description: "Discover therapists skilled in helping you manage anxiety, stress, and panic attacks. Learn coping techniques and build resilience.",
    content: "Constant worry, panic, or overwhelming stress can significantly impact your daily life. Therapists specializing in anxiety can help you identify triggers, challenge negative thought patterns, and develop effective strategies like mindfulness, relaxation techniques, and cognitive restructuring to regain control and find peace."
  },
  'california': {
    title: "Licensed Therapists in California",
    description: "Browse our extensive list of verified mental health professionals across California. Find support for various issues in cities like Los Angeles, San Francisco, San Diego, and more.",
    content: "California offers a diverse range of therapeutic services. Whether you're in a major city or a smaller town, TherapistDB can help you connect with a licensed professional. Many California therapists also offer telehealth services, expanding your options for care regardless of your specific location within the state."
  },
  // Add more for common issues, specialties, and states
};


export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const city = typeof searchParams.city === 'string' ? capitalize(formatSlugForDisplay(searchParams.city)) : undefined;
  const stateSlug = typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const stateName = stateSlug ? capitalize(formatSlugForDisplay(stateSlug)) : undefined;
  const specialty = typeof searchParams.specialty === 'string' ? formatSlugForDisplay(searchParams.specialty) : undefined;
  const issue = typeof searchParams.issue === 'string' ? formatSlugForDisplay(searchParams.issue) : undefined;

  let title = 'Find Therapists & Counselors | TherapistDB';
  let description = 'Search our directory of verified mental health professionals. Filter by location, specialty, insurance, and more to find the right fit for you.';
  const keywords: string[] = ['therapist directory', 'mental health', 'counseling', 'psychologist', 'find therapist'];

  let locationQuery = '';
  if (city && stateName) locationQuery = `in ${city}, ${stateName}`;
  else if (stateName) locationQuery = `in ${stateName}`;
  else if (city) locationQuery = `in ${city}`;
  else if (zip) locationQuery = `near ${zip}`;

  const focusTerm = specialty || issue;
  const focusSlug = searchParams.specialty || searchParams.issue;

  if (focusTerm && typeof focusSlug === 'string' && SEO_BLURBS[focusSlug]) {
    title = `${SEO_BLURBS[focusSlug].title} ${locationQuery} | TherapistDB`;
    description = `${SEO_BLURBS[focusSlug].description.replace('LOCATION_PLACEHOLDER', locationQuery)} Find support on TherapistDB.`;
    keywords.push(focusTerm, `${focusTerm} therapy`);
  } else if (focusTerm) {
    title = `${capitalize(focusTerm)} Therapists ${locationQuery} | TherapistDB`;
    description = `Find qualified ${capitalize(focusTerm)} therapists ${locationQuery}. Browse profiles, and connect for mental health support on TherapistDB.`;
    keywords.push(focusTerm, `${focusTerm} therapy`);
  } else if (stateSlug && SEO_BLURBS[stateSlug]) {
    title = `${SEO_BLURBS[stateSlug].title} | TherapistDB`;
    description = SEO_BLURBS[stateSlug].description;
  } else if (locationQuery) {
    title = `Therapists & Counselors ${locationQuery} | TherapistDB`;
    description = `Browse licensed therapists and counselors ${locationQuery}. Find local mental health support through TherapistDB.`;
  }

  if (city) keywords.push(city, `${city} therapists`);
  if (stateName) keywords.push(stateName, `${stateName} therapists`);
  if (zip) keywords.push(zip, `therapists near ${zip}`);

  const urlBase = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const canonicalUrl = new URL('/therapists', urlBase);
  // Add only primary search params to canonical URL for SEO stability
  if (zip) canonicalUrl.searchParams.set('zip', zip);
  if (city && !zip) canonicalUrl.searchParams.set('city', searchParams.city as string); // use original slug
  if (stateSlug && !zip) canonicalUrl.searchParams.set('state', stateSlug); // use original slug
  if (focusSlug && !zip) canonicalUrl.searchParams.set(searchParams.specialty ? 'specialty' : 'issue', focusSlug);


  return {
    title,
    description,
    keywords: [...new Set(keywords)].slice(0, 15),
    alternates: { canonical: canonicalUrl.toString() },
    openGraph: {
      title, description, url: canonicalUrl.toString(),
      siteName: 'TherapistDB', locale: 'en_US', type: 'website',
    },
  };
}

export default async function TherapistsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  console.log("THERAPISTS_PAGE: Rendering. Search params:", searchParams);

  const page = parseInt((searchParams.page as string) || '1', 10);
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const cityParamSlug = typeof searchParams.city === 'string' ? searchParams.city : undefined;
  const stateParamSlug = typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const specialtyParamSlug = typeof searchParams.specialty === 'string' ? searchParams.specialty : undefined;
  const issueParamSlug = typeof searchParams.issue === 'string' ? searchParams.issue : undefined;

  // --- Prisma Query Construction ---
  const where: any = { published: true };
  if (zip) where.primaryZip = zip;
  if (cityParamSlug) where.primaryCity = { equals: formatSlugForDisplay(cityParamSlug), mode: 'insensitive' };
  if (stateParamSlug) {
      // This requires your DB to store states in a way that can match formatted slugs (e.g., "California", "New York")
      // Or have a dedicated stateSlug field in Prisma therapist model.
      where.primaryState = { equals: formatSlugForDisplay(stateParamSlug), mode: 'insensitive' };
  }

  const filterTermSlug = specialtyParamSlug || issueParamSlug;
  if (filterTermSlug) {
    const formattedTerm = formatSlugForDisplay(filterTermSlug);
    where.OR = [
      { issues: { has: formattedTerm } },
      { issues: { has: filterTermSlug } }, // Search by slug too
      { treatmentStyle: { has: formattedTerm } },
      { treatmentStyle: { has: filterTermSlug } },
      { specialtyDescription: { contains: formattedTerm, mode: 'insensitive' } },
    ];
  }

  // Incorporate filters from ClientFilters component
  if (searchParams.gender) where.gender = searchParams.gender as string;
  if (searchParams.insurance) where.insuranceAccepted = { contains: searchParams.insurance as string, mode: 'insensitive' };
  if (searchParams.degree) where.primaryCredential = { contains: searchParams.degree as string, mode: 'insensitive' }; // Or use `profession`
  if (searchParams.remote === 'Yes') where.telehealth = true;
  else if (searchParams.remote === 'No') where.telehealth = {not: true}; // Or where.inPerson = true
  if (searchParams.price) {
    const priceOpt = searchParams.price as string;
    // This requires feeIndividual to be a string like "$100 - $150" or a number.
    // If it's just numbers in DB, this needs to be adapted.
    // For now, assuming string matching from dropdown values.
    if (priceOpt === '< $100 per session') where.feeIndividual = { startsWith: '$', /* then parse and lt 100 logic */ }; // Complex
    // A simpler approach for string fees: have a numeric range field or categories in DB.
  }
  if (searchParams.age) where.ages = { has: searchParams.age as string }; // Assuming 'age' from dropdown is a value in 'ages' array
  if (searchParams.condition) { // 'condition' from ClientFilters maps to 'issue' for this page
      const conditionFormatted = formatSlugForDisplay(searchParams.condition as string);
      if (where.OR) { // Add to existing OR clause if filterTermSlug was present
          where.OR.push({ issues: { has: conditionFormatted }});
          where.OR.push({ issues: { has: searchParams.condition as string }});
      } else {
          where.OR = [
              { issues: { has: conditionFormatted } },
              { issues: { has: searchParams.condition as string } }
          ];
      }
  }
  if (searchParams.language) where.languages = { has: searchParams.language as string };
  if (searchParams.faith) where.communities = { has: searchParams.faith as string }; // Assuming 'faith' from dropdown is in 'communities' array
  if (searchParams.treatmentStyle) { // 'treatmentStyle' from ClientFilters
    const styleFormatted = formatSlugForDisplay(searchParams.treatmentStyle as string);
     if (where.OR && filterTermSlug && filterTermSlug !== searchParams.treatmentStyle) { // If filterTerm was for issue/specialty, add to OR
        where.OR.push({ treatmentStyle: { has: styleFormatted }});
        where.OR.push({ treatmentStyle: { has: searchParams.treatmentStyle as string }});
     } else if (!filterTermSlug) { // If no main issue/specialty, treatmentStyle becomes the main OR
        where.OR = [
            { treatmentStyle: { has: styleFormatted } },
            { treatmentStyle: { has: searchParams.treatmentStyle as string } }
        ];
     } // If filterTermSlug IS treatmentStyle, it's already handled.
  }


  const total = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page < 1 || (totalPages > 0 && page > totalPages && total > 0)) {
    notFound();
  }

  const therapistsFromDB: TherapistFromDB[] = await prisma.therapist.findMany({
    where,
    select: { // Ensure all fields needed by TherapistDataForCard AND for AI ranking are here
      id: true, name: true, slug: true, imageUrl: true, primaryCredential: true,
      primaryCredentialAlt: true, tagline: true, feeIndividual: true, feeCouples: true,
      slidingScale: true, paymentMethods: true, insuranceAccepted: true,
      primaryCity: true, primaryState: true, primaryZip: true, issues: true, languages: true,
      telehealth: true, personalStatement1: true, treatmentStyle: true,
      // Add other fields required by TherapistDataForCard (from its definition)
      profession: true, // Example, if TherapistDataForCard needs it
    },
    orderBy: { name: 'asc' }, // Could add more complex sorting later
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // --- AI Ranking ---
  let displayedTherapists: TherapistDataForCard[] = therapistsFromDB.map(t => ({...t})); // Ensure all fields are passed
  let reasonMap = new Map<string, string>();
  let aiError: string | null = null;
  const aiMatchingIssue = issueParamSlug || specialtyParamSlug || (searchParams.condition as string);

  if (aiMatchingIssue && therapistsFromDB.length > 0) {
    try {
      const therapistsForRankingAPI = therapistsFromDB.map(t => ({
        id: t.id, name: t.name, specialties: t.issues, bio: t.personalStatement1,
        treatmentStyle: t.treatmentStyle, telehealth: t.telehealth,
        // Add other relevant fields for AI from TherapistFromDB
      }));
      const rankingApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rank-therapists`;
      const res = await fetch(rankingApiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue: formatSlugForDisplay(aiMatchingIssue), therapists: therapistsForRankingAPI }),
        cache: 'no-store',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `API request failed: ${res.status}` }));
        aiError = errorData.error; console.error("AI Ranking API Error:", aiError);
      } else {
        const { ranked, error: apiErr } = await res.json();
        if (apiErr) { aiError = apiErr; console.error("AI API returned error property:", apiErr); }
        else if (ranked?.length) {
            reasonMap = new Map(ranked.map((r: RankedItem) => [r.id, r.reason]));
            displayedTherapists = ranked
              .map((rankedItem: RankedItem) => therapistsFromDB.find(t => t.id === rankedItem.id))
              .filter((t): t is TherapistFromDB => Boolean(t)) // Use TherapistFromDB then map
              .map(t => ({...t})); // Map to TherapistDataForCard

            therapistsFromDB.forEach(dbT => {
                if (!displayedTherapists.some(dispT => dispT.id === dbT.id)) displayedTherapists.push({...dbT});
            });
        } else { aiError = "AI ranking returned no results or unexpected format."; console.warn(aiError); }
      }
    } catch (err: any) { aiError = `Connection error with AI ranking: ${err.message}`; console.error(aiError, err); }
  }

  // --- Dynamic Page Title and Intro Blurb ---
  let pageTitle = "Find a Mental Health Professional";
  let pageIntro = "Browse our directory of verified therapists and counselors. Use the filters to narrow your search.";
  let seoContentBlurb: string | undefined = undefined;

  const displayCity = cityParamSlug ? capitalize(formatSlugForDisplay(cityParamSlug)) : undefined;
  const displayState = stateParamSlug ? capitalize(formatSlugForDisplay(stateParamSlug)) : undefined;
  const displayLocation = displayCity && displayState ? `in ${displayCity}, ${displayState}`
                       : displayState ? `in ${displayState}`
                       : displayCity ? `in ${displayCity}`
                       : zip ? `near ${zip}` : "";

  const displayFocusTerm = specialtyParamSlug ? capitalize(formatSlugForDisplay(specialtyParamSlug))
                         : issueParamSlug ? capitalize(formatSlugForDisplay(issueParamSlug))
                         : (searchParams.condition as string) ? capitalize(formatSlugForDisplay(searchParams.condition as string))
                         : undefined;

  const currentFocusSlug = specialtyParamSlug || issueParamSlug || (searchParams.condition as string);

  if (currentFocusSlug && SEO_BLURBS[currentFocusSlug]) {
    pageTitle = `${SEO_BLURBS[currentFocusSlug].title} ${displayLocation}`;
    pageIntro = SEO_BLURBS[currentFocusSlug].description.replace('LOCATION_PLACEHOLDER', displayLocation || "your area");
    seoContentBlurb = SEO_BLURBS[currentFocusSlug].content?.replace('LOCATION_PLACEHOLDER', displayLocation || "your area");
  } else if (displayFocusTerm) {
    pageTitle = `${displayFocusTerm} Therapists ${displayLocation}`;
    pageIntro = `Find therapists specializing in ${displayFocusTerm} ${displayLocation}. Start your journey to wellness today.`;
  } else if (stateParamSlug && SEO_BLURBS[stateParamSlug]) {
    pageTitle = SEO_BLURBS[stateParamSlug].title;
    pageIntro = SEO_BLURBS[stateParamSlug].description;
    seoContentBlurb = SEO_BLURBS[stateParamSlug].content;
  }
   else if (displayLocation) {
    pageTitle = `Therapists ${displayLocation}`;
    pageIntro = `Discover local therapists and counselors ${displayLocation}.`;
  }

  // Prepare searchParamsObject for TherapistList (used by Pagination)
  const searchParamsObjectForList: { [key: string]: string | undefined } = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== 'page' && typeof value === 'string') searchParamsObjectForList[key] = value;
  });

  return (
    <div className="bg-[#F7F9FC] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 sm:pt-12">
            <header className="text-center mb-10 md:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 !leading-tight">
                    {pageTitle}
                </h1>
                <p className="text-md sm:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                    {pageIntro}
                </p>
            </header>

            {/* SEO Content Blurb Area */}
            {seoContentBlurb && (
                <section className="mb-10 md:mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                        {/* Render HTML if blurb contains it, or simple paragraphs */}
                        <div dangerouslySetInnerHTML={{ __html: seoContentBlurb }} />
                        {/* Or if it's plain text: <p>{seoContentBlurb}</p> */}
                    </div>
                </section>
            )}

            <TherapistList
              therapists={displayedTherapists}
              reasonMap={reasonMap}
              aiError={aiError}
              totalTherapistsCount={total}
              totalPages={totalPages}
              currentPage={page}
              searchParamsObject={searchParamsObjectForList}
              currentZip={zip}
              currentIssue={aiMatchingIssue ? formatSlugForDisplay(aiMatchingIssue) : undefined}
            />
        </div>
    </div>
  );
}