// src/app/therapists/therapist-data.ts

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatSlugForDisplay } from '@/utils/formatting';
import { rankTherapistsByIssue } from '@/lib/ai';
import { PAGE_SIZE } from './constants';
import { TherapistFromDB, TherapistsPageData, SearchParams } from './types';
import type { Gender } from '@prisma/client';

const normalizeGender = (raw: string): Gender | undefined => {
  const val = raw.toLowerCase().trim();
  switch (val) {
    case 'female': return 'FEMALE';
    case 'male': return 'MALE';
    case 'non-binary': return 'NON_BINARY';
    case 'transgender': return 'TRANSGENDER';
    case 'prefer not to say': return 'PREFER_NOT_TO_SAY';
    default: return undefined;
  }
};

export function buildTherapistQueryFromParams(params: SearchParams) {
  const where: any = { published: true };

  const zip = typeof params.zip === 'string' ? params.zip : undefined;
  const city = typeof params.city === 'string' ? params.city : undefined;
  const state = typeof params.state === 'string' ? params.state : undefined;
  const specialty = typeof params.specialty === 'string' ? params.specialty : undefined;
  const issue = typeof params.issue === 'string' ? params.issue : undefined;
  const condition = typeof params.condition === 'string' ? params.condition : undefined;

  if (zip) where.primaryZip = zip;
  if (city) where.primaryCity = { equals: formatSlugForDisplay(city), mode: 'insensitive' };
  if (state) where.primaryState = { equals: formatSlugForDisplay(state), mode: 'insensitive' };

  const orTerms = [specialty, issue, condition, params.treatmentStyle].filter(Boolean);
  const orConditions = [];

  for (const term of orTerms) {
    const formatted = formatSlugForDisplay(term!);
    orConditions.push(
      { issues: { has: formatted } },
      { treatmentStyle: { has: formatted } },
      { specialtyDescription: { contains: formatted, mode: 'insensitive' } }
    );
  }

  if (orConditions.length) {
    where.OR = orConditions;
  }

  if (params.gender) {
    const genderEnum = normalizeGender(params.gender);
    if (genderEnum) where.gender = genderEnum;
    else console.warn(`[Filter Warning] Unrecognized gender value: "${params.gender}"`);
  }

  if (params.insurance) where.insuranceAccepted = { has: params.insurance };
  if (params.degree) where.primaryCredential = { contains: params.degree, mode: 'insensitive' };
  if (params.remote === 'Yes') where.telehealth = true;
  else if (params.remote === 'No') where.telehealth = { not: true };
  if (params.age) where.ages = { has: params.age };
  if (params.language) where.languages = { has: params.language };
  if (params.faith) where.communities = { has: params.faith };

  return where;
}

export async function getTherapistsPageData(params: SearchParams): Promise<TherapistsPageData> {
  const page = parseInt((params.page as string) || '1', 10);
  const where = buildTherapistQueryFromParams(params);

  const total = await prisma.therapist.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (page < 1 || (totalPages > 0 && page > totalPages)) notFound();

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
      languages: true, telehealth: true, personalStatement1: true, treatmentStyle: true,
      profession: true, ages: true, communities: true,
    },
  });

  let reasonMap = new Map<string, string>();
  let aiError: string | null = null;

  const rankingTerm = params.issue || params.specialty || params.condition;
  let therapists = [...therapistsFromDB];

  if (rankingTerm && therapists.length) {
    const { ranked, error } = await rankTherapistsByIssue(formatSlugForDisplay(rankingTerm as string), therapistsFromDB);
    if (error) {
      aiError = error;
    } else if (ranked?.length) {
      const scores = new Map(ranked.map(r => [r.id, r.reason]));
      reasonMap = scores;

      therapists.sort((a, b) => {
        const aScore = scores.has(a.id) ? 1 : 0;
        const bScore = scores.has(b.id) ? 1 : 0;
        return bScore - aScore;
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
    currentIssueForAI: rankingTerm ? formatSlugForDisplay(rankingTerm as string) : undefined,
  };
}
