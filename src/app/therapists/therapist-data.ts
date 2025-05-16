// src/app/therapists/therapist-data.ts

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatSlugForDisplay } from '@/utils/formatting';
import { rankTherapistsByIssue } from '@/lib/ai';
import { PAGE_SIZE } from './constants';
import type { TherapistFromDB, TherapistsPageData } from './types';
import type { Gender as PrismaGender } from '@prisma/client'; // Import generated Gender type

// This SearchParams interface should align with ParsedSearchParams from queryParams.ts
// or be imported from a shared types file.
export interface SearchParams {
  zip?: string;
  city?: string;
  state?: string;
  specialty?: string;
  issue?: string;
  condition?: string;
  gender?: string;
  // insurance?: string;
  degree?: string;
  remote?: string;
  age?: string;
  price?: string;
  faith?: string;
  language?: string;
  treatmentStyle?: string;
  page?: string | number;
}

const normalizeGender = (raw: string): PrismaGender | undefined => {
  const val = raw.toLowerCase().trim();
  switch (val) {
    case 'female': return 'FEMALE';
    case 'male': return 'MALE';
    case 'non-binary': return 'NON_BINARY';
    case 'transgender': return 'TRANSGENDER';
    case 'prefer not to say': return 'PREFER_NOT_TO_SAY';
    // case 'other': return 'OTHER'; // Add if 'Other' is an option in your UI
    default:
      console.warn(`[Filter Warning] Unrecognized gender value during normalization: "${raw}"`);
      return undefined;
  }
};

export function buildTherapistQueryFromParams(params: SearchParams) {
  const where: any = { published: true };
  const mainAndConditions: any[] = [];

  // Location
  if (params.zip) mainAndConditions.push({ primaryZip: params.zip });
  if (params.city) mainAndConditions.push({ primaryCity: { equals: formatSlugForDisplay(params.city), mode: 'insensitive' } });
  if (params.state) mainAndConditions.push({ primaryState: { equals: formatSlugForDisplay(params.state), mode: 'insensitive' } });

  // Specific Filters from ClientFilters Dropdowns
  if (params.gender) {
    const genderEnum = normalizeGender(params.gender);
    if (genderEnum) {
      mainAndConditions.push({ gender: genderEnum });
    }
  }

  if (params.insurance && params.insurance !== '') {
    mainAndConditions.push({ insuranceAccepted: { has: params.insurance } });
  }

  if (params.degree && params.degree !== '') {
    mainAndConditions.push({ primaryCredential: { contains: params.degree, mode: 'insensitive' } });
  }

  if (params.remote === 'Yes') {
    mainAndConditions.push({ telehealth: true });
  } else if (params.remote === 'No') {
    mainAndConditions.push({ telehealth: { not: true } });
  }

  if (params.age && params.age !== '') {
    mainAndConditions.push({ ages: { has: params.age } });
  }

  if (params.language && params.language !== '') {
    mainAndConditions.push({ languages: { has: params.language } });
  }

  if (params.faith && params.faith !== '') {
    mainAndConditions.push({ communities: { has: params.faith } });
  }

  // Price Filter (assumes feeIndividual is Int? in Prisma)
  if (params.price && params.price !== '') {
    const priceValue = params.price;
    let priceCondition;
    if (priceValue === '<$100 per session') {
      priceCondition = { lt: 100 };
    } else if (priceValue === '$100 - $150') {
      priceCondition = { gte: 100, lte: 150 };
    } else if (priceValue === '$150 - $200') {
      priceCondition = { gte: 150, lte: 200 };
    } else if (priceValue === '$200+ per session') {
      priceCondition = { gte: 200 };
    }
    if (priceCondition) {
      mainAndConditions.push({ feeIndividual: priceCondition });
    }
  }

  // Condition Filter
  if (params.condition && params.condition !== '') {
    // IMPORTANT: Adjust `conditionToSearch` based on how data is stored vs. `FILTER_OPTIONS`
    // If `FILTER_OPTIONS.Condition` values are stored as-is in `issues` array, no slugging needed.
    // If DB stores slugified versions, then `formatSlugForDisplay` is needed.
    const conditionToSearch = params.condition; // or formatSlugForDisplay(params.condition)
    mainAndConditions.push({
      OR: [
        { issues: { has: conditionToSearch } },
        { specialtyDescription: { contains: conditionToSearch, mode: 'insensitive' } }
      ],
    });
  }

  // Type of Therapy Filter
  if (params.treatmentStyle && params.treatmentStyle !== '') {
    // IMPORTANT: Adjust `styleToSearch` similarly to `conditionToSearch`
    const styleToSearch = params.treatmentStyle; // or formatSlugForDisplay(params.treatmentStyle)
    mainAndConditions.push({
      OR: [
        { treatmentStyle: { has: styleToSearch } },
        { specialtyDescription: { contains: styleToSearch, mode: 'insensitive' } }
      ],
    });
  }

  // General Search Terms (e.g., params.issue from IssueForm)
  const generalSearchTermsText: string[] = [];
  if (params.issue && typeof params.issue === 'string') generalSearchTermsText.push(params.issue);
  if (params.specialty && typeof params.specialty === 'string') generalSearchTermsText.push(params.specialty);

  if (generalSearchTermsText.length > 0) {
    const generalOrClauses: any[] = [];
    for (const term of generalSearchTermsText) {
      const formattedTerm = formatSlugForDisplay(term); // Assuming general terms are slugged for search
      generalOrClauses.push({ issues: { has: formattedTerm } });
      generalOrClauses.push({ treatmentStyle: { has: formattedTerm } });
      generalOrClauses.push({ specialtyDescription: { contains: formattedTerm, mode: 'insensitive' } });
      generalOrClauses.push({ name: { contains: formattedTerm, mode: 'insensitive' } });
    }
    if (generalOrClauses.length > 0) {
      mainAndConditions.push({ OR: generalOrClauses });
    }
  }

  if (mainAndConditions.length > 0) {
    where.AND = mainAndConditions;
  }

  return where;
}

export async function getTherapistsPageData(params: SearchParams): Promise<TherapistsPageData> {
  const page = parseInt((typeof params.page === 'string' ? params.page : params.page?.toString()) || '1', 10);
  const where = buildTherapistQueryFromParams(params);

  const total = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page < 1 || (totalPages > 0 && page > totalPages && total > 0)) {
     if (total > 0) notFound();
  }

  const therapistsFromDB: TherapistFromDB[] = await prisma.therapist.findMany({
    where,
    orderBy: { name: 'asc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true, name: true, slug: true, imageUrl: true, primaryCredential: true,
      primaryCredentialAlt: true, tagline: true, feeIndividual: true, feeCouples: true,
      slidingScale: true, paymentMethods: true, insuranceAccepted: true,
      primaryCity: true, primaryState: true, primaryZip: true, issues: true,
      languages: true, telehealth: true, personalStatement1: true,
      treatmentStyle: true, profession: true, ages: true, communities: true,
      specialtyDescription: true, // For AI context
    },
  });

  let reasonMap = new Map<string, string>();
  let aiError: string | null = null;
  let therapists = [...therapistsFromDB];

  const rankingTermForAI = params.issue || params.specialty || params.condition || params.treatmentStyle;

  if (rankingTermForAI && therapists.length > 0) {
    const therapistsForAIRanking = therapistsFromDB.map(t => ({
        id: t.id,
        description: `${t.tagline || ''} ${t.personalStatement1 || ''} ${t.specialtyDescription || ''}`,
        issues: t.issues,
        treatmentStyles: t.treatmentStyle,
    }));

    const { ranked, error } = await rankTherapistsByIssue(
        formatSlugForDisplay(rankingTermForAI as string),
        therapistsForAIRanking
    );

    if (error) {
      aiError = error;
      console.error("AI Ranking Error:", error);
    } else if (ranked?.length) {
      const rankedTherapistOrder = new Map(ranked.map((r, index) => [r.id, { reason: r.reason, rank: index }]));
      reasonMap = new Map(ranked.map(r => [r.id, r.reason]));
      therapists.sort((a, b) => {
        const aRankData = rankedTherapistOrder.get(a.id);
        const bRankData = rankedTherapistOrder.get(b.id);
        if (aRankData && bRankData) return aRankData.rank - bRankData.rank;
        if (aRankData) return -1;
        if (bRankData) return 1;
        return 0;
      });
    }
  }

  return {
    therapists,
    reasonMap,
    aiError,
    totalTherapistsCount: total,
    totalPages,
    currentPage: page,
    currentZip: typeof params.zip === 'string' ? params.zip : undefined,
    currentIssueForAI: rankingTermForAI ? formatSlugForDisplay(rankingTermForAI) : undefined,
  };
}