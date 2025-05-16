// src/app/therapists/types.ts
import { TherapistDataForCard } from '@/components/TherapistList/TherapistCard';

export interface RankedItem {
  id: string;
  reason: string;
  score: number;
}

export type TherapistFromDB = TherapistDataForCard & {
  personalStatement1?: string | null;
  treatmentStyle?: string[] | null;
  ages?: string[] | null;
  communities?: string[] | null;
  languages?: string[] | null;
};

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

export type SearchParams = Record<string, string | string[] | undefined>;
