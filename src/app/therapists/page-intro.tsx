import { capitalize, formatSlugForDisplay } from '@/utils/formatting';
import { SEO_BLURBS } from './metadata';
import { SearchParams } from './types';

export function buildPageIntro(searchParams: SearchParams) {
  const zip = typeof searchParams.zip === 'string' ? searchParams.zip : undefined;
  const city = typeof searchParams.city === 'string' ? capitalize(formatSlugForDisplay(searchParams.city)) : undefined;
  const stateSlug = typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const stateName = stateSlug ? capitalize(formatSlugForDisplay(stateSlug)) : undefined;
  const specialty = typeof searchParams.specialty === 'string' ? formatSlugForDisplay(searchParams.specialty) : undefined;
  const issue = typeof searchParams.issue === 'string' ? formatSlugForDisplay(searchParams.issue) : undefined;
  const condition = typeof searchParams.condition === 'string' ? formatSlugForDisplay(searchParams.condition) : undefined;

  let locationQuery = '';
  if (city && stateName) locationQuery = `in ${city}, ${stateName}`;
  else if (stateName) locationQuery = `in ${stateName}`;
  else if (city) locationQuery = `in ${city}`;
  else if (zip) locationQuery = `near ${zip}`;

  const focusTerm = specialty || issue || condition;
  const focusSlug = (searchParams.specialty as string) || (searchParams.issue as string) || (searchParams.condition as string);

  let title = "Find a Mental Health Professional";
  let subtitle = "Browse our directory of verified therapists and counselors. Use the filters to narrow your search.";
  let contentBlurb;

  if (focusTerm && focusSlug && SEO_BLURBS[focusSlug]) {
    title = `${SEO_BLURBS[focusSlug].title} ${locationQuery}`;
    subtitle = SEO_BLURBS[focusSlug].description.replace('LOCATION_PLACEHOLDER', locationQuery);
    contentBlurb = SEO_BLURBS[focusSlug].content?.replace('LOCATION_PLACEHOLDER', locationQuery);
  } else if (focusTerm) {
    title = `${capitalize(focusTerm)} Therapists ${locationQuery}`;
    subtitle = `Find therapists specializing in ${focusTerm} ${locationQuery}. Start your journey to wellness today.`;
  } else if (stateSlug && SEO_BLURBS[stateSlug]) {
    title = SEO_BLURBS[stateSlug].title;
    subtitle = SEO_BLURBS[stateSlug].description;
    contentBlurb = SEO_BLURBS[stateSlug].content;
  } else if (locationQuery) {
    title = `Therapists ${locationQuery}`;
    subtitle = `Discover local therapists and counselors ${locationQuery}.`;
  }

  return { title, subtitle, contentBlurb };
}
