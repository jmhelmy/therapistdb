// src/app/therapists/queryParams.ts

import { capitalize, formatSlugForDisplay } from '@/utils/formatting';

export function parseSearchParams(rawParams: Record<string, string | string[] | undefined>) {
  const get = (key: string) => typeof rawParams[key] === 'string' ? rawParams[key] as string : undefined;

  return {
    zip: get('zip'),
    citySlug: get('city'),
    stateSlug: get('state'),
    cityName: get('city') ? capitalize(formatSlugForDisplay(get('city')!)) : undefined,
    stateName: get('state') ? capitalize(formatSlugForDisplay(get('state')!)) : undefined,
    specialty: get('specialty'),
    issue: get('issue'),
    condition: get('condition'),
    gender: get('gender'),
    insurance: get('insurance'),
    degree: get('degree'),
    remote: get('remote'),
    page: parseInt(get('page') || '1', 10),
  };
}
