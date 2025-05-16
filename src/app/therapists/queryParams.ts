// src/app/therapists/queryParams.ts

import { capitalize, formatSlugForDisplay } from '@/utils/formatting'; // Assuming these exist and work as intended

// Define a comprehensive interface for all expected search parameters
export interface ParsedSearchParams {
  zip?: string;
  city?: string;
  state?: string;
  specialty?: string;
  issue?: string;
  condition?: string;
  gender?: string;
  insurance?: string;
  degree?: string;
  remote?: string;
  age?: string;
  price?: string;
  faith?: string;
  language?: string;
  treatmentStyle?: string;
  page: number;

  // Retaining these from your original for consistency if used elsewhere
  citySlug?: string;
  stateSlug?: string;
  cityName?: string;
  stateName?: string;
}

export function parseSearchParams(
  rawParams: Record<string, string | string[] | undefined>
): ParsedSearchParams {
  const get = (key: string): string | undefined => {
    const value = rawParams[key];
    return typeof value === 'string' ? value : undefined;
  };

  const cityParam = get('city');
  const stateParam = get('state');

  return {
    zip: get('zip'),
    city: cityParam,
    state: stateParam,

    gender: get('gender'),
    insurance: get('insurance'),
    remote: get('remote'),
    degree: get('degree'),
    age: get('age'),
    condition: get('condition'),
    price: get('price'),
    faith: get('faith'),
    language: get('language'),
    treatmentStyle: get('treatmentStyle'),

    specialty: get('specialty'),
    issue: get('issue'),

    page: parseInt(get('page') || '1', 10),

    citySlug: cityParam,
    stateSlug: stateParam,
    cityName: cityParam ? capitalize(formatSlugForDisplay(cityParam)) : undefined,
    stateName: stateParam ? capitalize(formatSlugForDisplay(stateParam)) : undefined,
  };
}