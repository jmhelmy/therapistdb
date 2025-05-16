// src/app/therapists/page.tsx
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TherapistList from '@/components/TherapistList/TherapistList';
import { TherapistDataForCard } from '@/components/TherapistList/TherapistCard';
import { formatSlugForDisplay, capitalize } from '@/utils/formatting';

const PAGE_SIZE = 10;

interface RankedItem { id: string; reason: string; score: number; }

type TherapistFromDB = TherapistDataForCard & {
  personalStatement1?: string | null;
  treatmentStyle?: string[] | null;
  languages?: string[] | null;
};

const SEO_BLURBS: Record<string, { title: string, description: string, content?: string }> = {
  'depression': { /* ... */ },
  'anxiety-stress': { /* ... */ },
  'california': { /* ... */ },
};

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams: initialSearchParams }: PageProps): Promise<Metadata> {
  await Promise.resolve(); 

  const zipParam = typeof initialSearchParams.zip === 'string' ? initialSearchParams.zip : undefined;
  const citySlugParam = typeof initialSearchParams.city === 'string' ? initialSearchParams.city : undefined;
  const stateSlugParam = typeof initialSearchParams.state === 'string' ? initialSearchParams.state : undefined;
  const specialtySlugParam = typeof initialSearchParams.specialty === 'string' ? initialSearchParams.specialty : undefined;
  let issueForMetadata: string | undefined;
  if (typeof initialSearchParams.issue === 'string' && initialSearchParams.issue.length < 50 && !initialSearchParams.issue.includes(' ')) {
      issueForMetadata = formatSlugForDisplay(initialSearchParams.issue);
  }

  const cityForDisplay = citySlugParam ? capitalize(formatSlugForDisplay(citySlugParam)) : undefined;
  const stateNameForDisplay = stateSlugParam ? capitalize(formatSlugForDisplay(stateSlugParam)) : undefined;
  const specialtyForDisplay = specialtySlugParam ? formatSlugForDisplay(specialtySlugParam) : undefined;

  let title = 'Find Therapists & Counselors | TherapistDB';
  let description = 'Search our directory of verified mental health professionals. Filter by location, specialty, insurance, and more to find the right fit for you.';
  const keywords: string[] = ['therapist directory', 'mental health', 'counseling', 'psychologist', 'find therapist'];
  let locationQuery = '';
  if (cityForDisplay && stateNameForDisplay) locationQuery = `in ${cityForDisplay}, ${stateNameForDisplay}`;
  else if (stateNameForDisplay) locationQuery = `in ${stateNameForDisplay}`;
  else if (cityForDisplay) locationQuery = `in ${cityForDisplay}`;
  else if (zipParam) locationQuery = `near ${zipParam}`;

  const focusTerm = specialtyForDisplay || issueForMetadata;
  const focusSlugForSeoBlurb = specialtySlugParam || (issueForMetadata ? initialSearchParams.issue : undefined);

  if (focusTerm && focusSlugForSeoBlurb && SEO_BLURBS[focusSlugForSeoBlurb]) {
    title = `${SEO_BLURBS[focusSlugForSeoBlurb].title} ${locationQuery} | TherapistDB`;
    description = `${SEO_BLURBS[focusSlugForSeoBlurb].description.replace('LOCATION_PLACEHOLDER', locationQuery)} Find support on TherapistDB.`;
    keywords.push(focusTerm, `${focusTerm} therapy`);
  } else if (focusTerm) {
    title = `${capitalize(focusTerm)} Therapists ${locationQuery} | TherapistDB`;
    description = `Find qualified ${capitalize(focusTerm)} therapists ${locationQuery}. Browse profiles, and connect for mental health support on TherapistDB.`;
    keywords.push(focusTerm, `${focusTerm} therapy`);
  } else if (stateSlugParam && SEO_BLURBS[stateSlugParam]) {
    title = `${SEO_BLURBS[stateSlugParam].title} | TherapistDB`;
    description = SEO_BLURBS[stateSlugParam].description;
  } else if (locationQuery) {
    title = `Therapists & Counselors ${locationQuery} | TherapistDB`;
    description = `Browse licensed therapists and counselors ${locationQuery}. Find local mental health support through TherapistDB.`;
  }

  if (cityForDisplay) keywords.push(cityForDisplay, `${cityForDisplay} therapists`);
  if (stateNameForDisplay) keywords.push(stateNameForDisplay, `${stateNameForDisplay} therapists`);
  if (zipParam) keywords.push(zipParam, `therapists near ${zipParam}`);

  const urlBase = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const canonicalUrl = new URL('/therapists', urlBase);
  if (zipParam) canonicalUrl.searchParams.set('zip', zipParam);
  if (citySlugParam && !zipParam) canonicalUrl.searchParams.set('city', citySlugParam);
  if (stateSlugParam && !zipParam) canonicalUrl.searchParams.set('state', stateSlugParam);
  if (focusSlugForSeoBlurb && !zipParam) canonicalUrl.searchParams.set(specialtySlugParam ? 'specialty' : 'issue', focusSlugForSeoBlurb);

  return { /* ... metadata object ... */ };
}

export default async function TherapistsPage({ searchParams: initialSearchParams }: PageProps) {
  await Promise.resolve();

  const pageQueryParam = initialSearchParams.page as string || '1';
  const zipQueryParam = typeof initialSearchParams.zip === 'string' ? initialSearchParams.zip : undefined;
  const citySlugQueryParam = typeof initialSearchParams.city === 'string' ? initialSearchParams.city : undefined;
  const stateSlugQueryParam = typeof initialSearchParams.state === 'string' ? initialSearchParams.state : undefined;
  const specialtySlugQueryParam = typeof initialSearchParams.specialty === 'string' ? initialSearchParams.specialty : undefined;
  const freeTextIssueQueryParam = typeof initialSearchParams.issue === 'string' ? initialSearchParams.issue.trim() : undefined;
  const genderQueryParam = typeof initialSearchParams.gender === 'string' ? initialSearchParams.gender : undefined;
  const insuranceQueryParam = typeof initialSearchParams.insurance === 'string' ? initialSearchParams.insurance : undefined;
  const degreeQueryParam = typeof initialSearchParams.degree === 'string' ? initialSearchParams.degree : undefined;
  const remoteQueryParam = typeof initialSearchParams.remote === 'string' ? initialSearchParams.remote : undefined;
  const priceQueryParam = typeof initialSearchParams.price === 'string' ? initialSearchParams.price : undefined;
  const ageQueryParam = typeof initialSearchParams.age === 'string' ? initialSearchParams.age : undefined;
  const conditionQueryParam = typeof initialSearchParams.condition === 'string' ? initialSearchParams.condition : undefined;
  const languageQueryParam = typeof initialSearchParams.language === 'string' ? initialSearchParams.language : undefined;
  const faithQueryParam = typeof initialSearchParams.faith === 'string' ? initialSearchParams.faith : undefined;
  const treatmentStyleQueryParam = typeof initialSearchParams.treatmentStyle === 'string' ? initialSearchParams.treatmentStyle : undefined;

  const currentPage = parseInt(pageQueryParam, 10);
  const where: any = { published: true };
  if (zipQueryParam) where.primaryZip = zipQueryParam;
  if (citySlugQueryParam) where.primaryCity = { equals: formatSlugForDisplay(citySlugQueryParam), mode: 'insensitive' };
  if (stateSlugQueryParam) where.primaryState = { equals: formatSlugForDisplay(stateSlugQueryParam), mode: 'insensitive' };

  const structuredFilterTermSlug = specialtySlugQueryParam || conditionQueryParam;
  if (structuredFilterTermSlug) {
    const formattedTerm = formatSlugForDisplay(structuredFilterTermSlug);
    if (!where.OR) where.OR = [];
    where.OR.push(
      { issues: { has: formattedTerm } }, { issues: { has: structuredFilterTermSlug } },
      { treatmentStyle: { has: formattedTerm } }, { treatmentStyle: { has: structuredFilterTermSlug } },
      { specialtyDescription: { contains: formattedTerm, mode: 'insensitive' } }
    );
  }
  if (genderQueryParam) where.gender = genderQueryParam;
  if (insuranceQueryParam) where.insuranceAccepted = { contains: insuranceQueryParam, mode: 'insensitive' };
  if (degreeQueryParam) where.primaryCredential = { contains: degreeQueryParam, mode: 'insensitive' };
  if (remoteQueryParam === 'Yes') where.telehealth = true;
  else if (remoteQueryParam === 'No') where.telehealth = false;
  if (priceQueryParam) { /* ... price logic ... */ }
  if (ageQueryParam) where.ages = { has: ageQueryParam };
  if (languageQueryParam) where.languages = { has: languageQueryParam };
  if (faithQueryParam) where.communities = { has: faithQueryParam };
  if (treatmentStyleQueryParam) {
    const styleFormatted = formatSlugForDisplay(treatmentStyleQueryParam);
    if (!where.OR) where.OR = [];
    where.OR.push({ treatmentStyle: { has: styleFormatted } }, { treatmentStyle: { has: treatmentStyleQueryParam } });
  }

  const total = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages && total > 0)) notFound();

  const therapistsFromDB: TherapistFromDB[] = await prisma.therapist.findMany({
    where,
    select: { 
      id: true, name: true, slug: true, imageUrl: true, primaryCredential: true,
      primaryCredentialAlt: true, tagline: true, feeIndividual: true, feeCouples: true,
      slidingScale: true, paymentMethods: true, insuranceAccepted: true, 
      primaryCity: true, primaryState: true, primaryZip: true, issues: true, 
      languages: true, telehealth: true, personalStatement1: true, treatmentStyle: true,
      profession: true, 
    },
    orderBy: { name: 'asc' }, skip: (currentPage - 1) * PAGE_SIZE, take: PAGE_SIZE,
  });

  let displayedTherapists: TherapistDataForCard[] = therapistsFromDB.map(t => ({...t}));
  let reasonMap = new Map<string, string>();
  let aiError: string | null = null;
  const isAiFreeTextSearchActive = !!(freeTextIssueQueryParam && freeTextIssueQueryParam !== "");
  let issueToSendToAI: string | undefined;
  let displayableCurrentIssueForText: string | undefined;

  if (isAiFreeTextSearchActive) {
    issueToSendToAI = freeTextIssueQueryParam;
    displayableCurrentIssueForText = freeTextIssueQueryParam;
  } else if (specialtySlugQueryParam) {
    issueToSendToAI = formatSlugForDisplay(specialtySlugQueryParam);
    displayableCurrentIssueForText = formatSlugForDisplay(specialtySlugQueryParam);
  } else if (conditionQueryParam) {
    issueToSendToAI = formatSlugForDisplay(conditionQueryParam);
    displayableCurrentIssueForText = formatSlugForDisplay(conditionQueryParam);
  }

  if (issueToSendToAI && therapistsFromDB.length > 0 && process.env.OPENAI_API_KEY) {
    try {
      const therapistsForRankingAPI = therapistsFromDB.map(t => ({
        id: t.id, name: t.name, specialties: t.issues, bio: t.personalStatement1,
        treatmentStyle: t.treatmentStyle, telehealth: t.telehealth, languages: t.languages, 
        insuranceAccepted: Array.isArray(t.insuranceAccepted) ? t.insuranceAccepted.join(', ') : t.insuranceAccepted,
        feeIndividual: t.feeIndividual, city: t.primaryCity, state: t.primaryState, seoZip1: t.primaryZip,     
      }));
      const rankingApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rank-therapists`;
      const res = await fetch(rankingApiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue: issueToSendToAI, therapists: therapistsForRankingAPI }),
        cache: 'no-store',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `AI Ranking API request failed with status: ${res.status}` }));
        aiError = errorData.error || `AI Ranking API request failed: ${res.status}`;
      } else {
        const { ranked, error: apiErr } = await res.json();
        if (apiErr) aiError = apiErr;
        else if (ranked?.length) {
            reasonMap = new Map(ranked.map((r: RankedItem) => [r.id, r.reason]));
            const rankedIds = new Set(ranked.map((r: RankedItem) => r.id));
            const rankedTherapistsFromAPI = ranked
              .map((rankedItem: RankedItem) => therapistsFromDB.find(t => t.id === rankedItem.id))
              .filter((t): t is TherapistFromDB => Boolean(t)).map(t => ({...t})); 
            const unrankedTherapists = therapistsFromDB.filter(t => !rankedIds.has(t.id)).map(t => ({...t})); 
            displayedTherapists = [...rankedTherapistsFromAPI, ...unrankedTherapists];
        } else aiError = "AI ranking returned no results or unexpected format.";
      }
    } catch (err: any) { aiError = `Connection error during AI ranking: ${err.message}`; }
  } else if (issueToSendToAI && !process.env.OPENAI_API_KEY) {
    aiError = "AI ranking is not configured (OpenAI API key missing).";
  }

  let pageTitle = "Find a Mental Health Professional";
  let pageIntro = "Browse our directory of verified therapists and counselors. Use the filters to narrow your search.";
  let seoContentBlurb: string | undefined = undefined;
  const displayCityForUI = citySlugQueryParam ? capitalize(formatSlugForDisplay(citySlugQueryParam)) : undefined;
  const displayStateForUI = stateSlugQueryParam ? capitalize(formatSlugForDisplay(stateSlugQueryParam)) : undefined;
  const displayLocationForUI = displayCityForUI && displayStateForUI ? `in ${displayCityForUI}, ${displayStateForUI}`
                       : displayStateForUI ? `in ${displayStateForUI}`
                       : displayCityForUI ? `in ${displayCityForUI}`
                       : zipQueryParam ? `near ${zipQueryParam}` : "";

  if (isAiFreeTextSearchActive && freeTextIssueQueryParam) {
      pageTitle = `Therapists for "${freeTextIssueQueryParam.substring(0, 30)}${freeTextIssueQueryParam.length > 30 ? '...' : ''}" ${displayLocationForUI}`;
      pageIntro = `Finding support for "${freeTextIssueQueryParam}". Explore therapists ${displayLocationForUI}.`;
  } else {
      const displayFocusTermForUI = specialtySlugQueryParam ? capitalize(formatSlugForDisplay(specialtySlugQueryParam))
                            : conditionQueryParam ? capitalize(formatSlugForDisplay(conditionQueryParam)) : undefined;
      const currentFocusSlugForSeoBlurb = specialtySlugQueryParam || conditionQueryParam; // For SEO blurbs, not free text
      if (currentFocusSlugForSeoBlurb && SEO_BLURBS[currentFocusSlugForSeoBlurb]) {
        pageTitle = `${SEO_BLURBS[currentFocusSlugForSeoBlurb].title} ${displayLocationForUI}`;
        pageIntro = SEO_BLURBS[currentFocusSlugForSeoBlurb].description.replace('LOCATION_PLACEHOLDER', displayLocationForUI || "your area");
        seoContentBlurb = SEO_BLURBS[currentFocusSlugForSeoBlurb].content?.replace('LOCATION_PLACEHOLDER', displayLocationForUI || "your area");
      } else if (displayFocusTermForUI) {
        pageTitle = `${displayFocusTermForUI} Therapists ${displayLocationForUI}`;
        pageIntro = `Find therapists specializing in ${displayFocusTermForUI} ${displayLocationForUI}. Start your journey to wellness today.`;
      } else if (stateSlugQueryParam && SEO_BLURBS[stateSlugQueryParam]) {
        pageTitle = SEO_BLURBS[stateSlugQueryParam].title;
        pageIntro = SEO_BLURBS[stateSlugQueryParam].description;
        seoContentBlurb = SEO_BLURBS[stateSlugQueryParam].content;
      } else if (displayLocationForUI) {
        pageTitle = `Therapists ${displayLocationForUI}`;
        pageIntro = `Discover local therapists and counselors ${displayLocationForUI}.`;
      }
  }

  const searchParamsObjectForList: { [key: string]: string | undefined } = {};
  Object.entries(initialSearchParams).forEach(([key, value]) => { // Line 303 in your error trace (end of this block)
    if (key !== 'page' && typeof value === 'string') {
        searchParamsObjectForList[key] = value;
    }
  }); // <<< THIS IS LINE 303 in the code above, likely where the error originates if something is wrong here or just before.

  // LINE 304 would be the blank line
  // LINE 305 is return (
  // LINE 306 is <div ... > where the error is reported
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

            {seoContentBlurb && (
                <section className="mb-10 md:mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: seoContentBlurb }} />
                    </div>
                </section>
            )}

            <TherapistList
              therapists={displayedTherapists}
              reasonMap={reasonMap}
              aiError={aiError}
              totalTherapistsCount={total}
              totalPages={totalPages}
              currentPage={currentPage}
              searchParamsObject={searchParamsObjectForList}
              currentZip={zipQueryParam}
              currentIssue={displayableCurrentIssueForText}
              showAiSuggestions={isAiFreeTextSearchActive && !aiError}
            />
        </div>
    </div>
  );
}