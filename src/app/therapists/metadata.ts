import { Metadata } from 'next';
import { capitalize, formatSlugForDisplay } from '@/utils/formatting'; // Ensure this utility file exists

// Predefined blurbs for SEO content
export const SEO_BLURBS: Record<string, { title: string, description: string, content?: string }> = {
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

export async function generatePageMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
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
  const focusSlug = (searchParams.specialty as string) || (searchParams.issue as string);


  if (focusTerm && focusSlug && SEO_BLURBS[focusSlug]) {
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
  const primaryParams: { [key: string]: string } = {};
  if (zip) primaryParams.zip = zip;
  if (city && !zip && typeof searchParams.city === 'string') primaryParams.city = searchParams.city;
  if (stateSlug && !zip) primaryParams.state = stateSlug;
  if (focusSlug && !zip) primaryParams[searchParams.specialty ? 'specialty' : 'issue'] = focusSlug;

  Object.entries(primaryParams).forEach(([key, value]) => {
    canonicalUrl.searchParams.set(key, value);
  });

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