// src/app/therapists/therapist-data.ts
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TherapistDataForCard } from '@/components/TherapistList/TherapistCard';
import { formatSlugForDisplay } from '@/utils/formatting';

export const PAGE_SIZE = 10;

export type TherapistFromDB = TherapistDataForCard & {
  personalStatement1?: string | null;
  treatmentStyle?: string[] | null;
  // Make sure all fields from your Prisma model that TherapistDataForCard might need are here
  // For example, if TherapistDataForCard uses `ages`, it should be here.
  ages?: string[] | null; // Changed from agesServed
  communities?: string[] | null; // Assuming 'communities' is the correct field name based on error.
};

interface RankedItem { id: string; reason: string; score: number; }

interface TherapistForAIRanking {
  id: string;
  name?: string | null;
  specialties?: string[] | null;
  bio?: string | null;
  treatmentStyle?: string[] | null;
  telehealth?: boolean | null;
  languages?: string[] | null;
  primaryCity?: string | null;
  primaryState?: string | null;
  primaryZip?: string | null;
  feeIndividual?: string | number | null;
}

export interface TherapistsPageData {
  therapists: TherapistDataForCard[];
  reasonMap: Map<string, string>;
  aiError: string | null;
  totalTherapistsCount: number;
  totalPages: number;
  currentPage: number;
  currentZip?: string;
  currentIssueForAI?: string;
}

function constructPrismaWhere(searchParams: { [key: string]: string | string[] | undefined }) {
  const where: any = { published: true };

  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const cityParamSlug = typeof searchParams.city === 'string' ? searchParams.city : undefined;
  const stateParamSlug = typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const specialtyParamSlug = typeof searchParams.specialty === 'string' ? searchParams.specialty : undefined;
  const issueParamSlug = typeof searchParams.issue === 'string' ? searchParams.issue : undefined;

  if (zip) where.primaryZip = zip;
  if (cityParamSlug) where.primaryCity = { equals: formatSlugForDisplay(cityParamSlug), mode: 'insensitive' };
  if (stateParamSlug) where.primaryState = { equals: formatSlugForDisplay(stateParamSlug), mode: 'insensitive' };

  const filterTermSlug = specialtyParamSlug || issueParamSlug;
  if (filterTermSlug) {
    const formattedTerm = formatSlugForDisplay(filterTermSlug);
    where.OR = [
      { issues: { has: formattedTerm } }, { issues: { has: filterTermSlug } },
      { treatmentStyle: { has: formattedTerm } }, { treatmentStyle: { has: filterTermSlug } },
      { specialtyDescription: { contains: formattedTerm, mode: 'insensitive' } },
    ];
  }

  if (searchParams.gender) where.gender = searchParams.gender as string;
  if (searchParams.insurance) where.insuranceAccepted = { contains: searchParams.insurance as string, mode: 'insensitive' };
  if (searchParams.degree) where.primaryCredential = { contains: searchParams.degree as string, mode: 'insensitive' };
  if (searchParams.remote === 'Yes') where.telehealth = true;
  else if (searchParams.remote === 'No') where.telehealth = { not: true };
  
  if (searchParams.price) {
    const priceOpt = searchParams.price as string;
    if (priceOpt === '< $100 per session') { /* where.feeIndividualNumeric = { lt: 100 }; */ }
    console.warn("Price filter is basic and may not work as expected with string fees:", priceOpt);
  }

  // FIX #1: Change agesServed to ages in the where clause
  if (searchParams.age) where.ages = { has: searchParams.age as string }; 
  
  const conditionParam = searchParams.condition as string | undefined;
  if (conditionParam) {
      const conditionFormatted = formatSlugForDisplay(conditionParam);
      const conditionClause = [{ issues: { has: conditionFormatted } }, { issues: { has: conditionParam } }];
      if (where.OR) { where.OR.push(...conditionClause); } 
      else { where.OR = conditionClause; }
  }

  const languageParam = searchParams.language as string | undefined;
  if (languageParam) where.languages = { has: languageParam };

  // Similarly, the error listed `communities` not `communitiesServed`.
  // FIX #2: Change communitiesServed to communities in the where clause
  const faithParam = searchParams.faith as string | undefined;
  if (faithParam) where.communities = { has: faithParam }; 
  
  const treatmentStyleParam = searchParams.treatmentStyle as string | undefined;
  if (treatmentStyleParam) {
    const styleFormatted = formatSlugForDisplay(treatmentStyleParam);
    const styleClause = [{ treatmentStyle: { has: styleFormatted } }, { treatmentStyle: { has: treatmentStyleParam } }];
    if (!filterTermSlug || (filterTermSlug && filterTermSlug !== treatmentStyleParam)) {
        if (where.OR) { where.OR.push(...styleClause); }
        else { where.OR = styleClause; }
    }
  }
  return where;
}

export async function getTherapistsPageData(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<TherapistsPageData> {
  console.log("THERAPIST_DATA: Fetching. Search params:", searchParams);
  const page = parseInt((searchParams.page as string) || '1', 10);
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;

  const where = constructPrismaWhere(searchParams);

  const totalTherapistsCount = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(totalTherapistsCount / PAGE_SIZE);

  if (page < 1 || (totalPages > 0 && page > totalPages && totalTherapistsCount > 0)) {
    notFound();
  }

  const therapistsFromDB: TherapistFromDB[] = await prisma.therapist.findMany({
    where,
    select: {
      id: true, name: true, slug: true, imageUrl: true, primaryCredential: true,
      primaryCredentialAlt: true, tagline: true, feeIndividual: true, feeCouples: true,
      slidingScale: true, paymentMethods: true, insuranceAccepted: true,
      primaryCity: true, primaryState: true, primaryZip: true, issues: true, languages: true,
      telehealth: true, personalStatement1: true, treatmentStyle: true,
      profession: true,
      gender: true, 
      // FIX #3: Change agesServed to ages in the select clause
      ages: true, 
      // FIX #4: Change communitiesServed to communities in the select clause (based on error msg)
      communities: true, 
    },
    orderBy: { name: 'asc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // ... (rest of the function remains the same)

  let displayedTherapists: TherapistDataForCard[] = therapistsFromDB.map(t => ({ ...t }));
  let reasonMap = new Map<string, string>();
  let aiError: string | null = null;

  const issueParamSlug = typeof searchParams.issue === 'string' ? searchParams.issue : undefined;
  const specialtyParamSlug = typeof searchParams.specialty === 'string' ? searchParams.specialty : undefined;
  const conditionParamForAI = typeof searchParams.condition === 'string' ? searchParams.condition : undefined;
  const currentIssueForAI = issueParamSlug || specialtyParamSlug || conditionParamForAI;

  if (currentIssueForAI && therapistsFromDB.length > 0) {
    try {
      const therapistsForRankingAPI: TherapistForAIRanking[] = therapistsFromDB.map(t => ({
        id: t.id,
        name: t.name,
        specialties: t.issues, 
        bio: t.personalStatement1,
        treatmentStyle: t.treatmentStyle,
        telehealth: t.telehealth,
        languages: t.languages,
        primaryCity: t.primaryCity,
        primaryState: t.primaryState,
        primaryZip: t.primaryZip,
        feeIndividual: t.feeIndividual,
      }));
      
      const rankingApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rank-therapists`;
      const res = await fetch(rankingApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: formatSlugForDisplay(currentIssueForAI),
          therapists: therapistsForRankingAPI
        }),
        cache: 'no-store', 
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `AI Ranking API request failed with status: ${res.status}` }));
        aiError = errorData.error || `AI Ranking API request failed: ${res.status}`;
        console.error("AI Ranking API Error:", aiError, errorData);
      } else {
        const { ranked, error: apiReturnedError } = await res.json();
        if (apiReturnedError) {
          aiError = apiReturnedError;
          console.error("AI Ranking API returned an error property:", apiReturnedError);
        } else if (ranked && Array.isArray(ranked) && ranked.length > 0) {
          const rankedScores: { [id: string]: { score: number; reason: string } } = {};
          ranked.forEach((r: RankedItem) => {
            if (r.id) rankedScores[r.id] = { score: r.score, reason: r.reason };
          });

          displayedTherapists = therapistsFromDB
            .map(t => ({
              ...t, 
              score: rankedScores[t.id]?.score ?? 0, 
              reason: rankedScores[t.id]?.reason ?? "Not specifically ranked by AI for this query.",
            }))
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0)); 

          reasonMap = new Map(displayedTherapists.map(t => [t.id, t.reason as string]));
        } else {
          aiError = "AI ranking returned no results or data in an unexpected format.";
          console.warn(aiError, "Raw ranked data:", ranked);
        }
      }
    } catch (err: any) {
      aiError = `Client-side error during AI ranking request: ${err.message}`;
      console.error(aiError, err);
    }
  }

  return {
    therapists: displayedTherapists,
    reasonMap,
    aiError,
    totalTherapistsCount,
    totalPages,
    currentPage: page,
    currentZip: zip,
    currentIssueForAI: currentIssueForAI ? formatSlugForDisplay(currentIssueForAI) : undefined,
  };
}