// src/app/therapists/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import Script from 'next/script';

// Import card components
import ClaimBanner from '@/components/therapistProfile/ClaimBanner';
import ProfileHeader from '@/components/therapistProfile/ProfileHeader';
import FinancesCard from '@/components/therapistProfile/FinancesCard';
import QualificationsCard from '@/components/therapistProfile/QualificationsCard';
import SpecialtiesCard from '@/components/therapistProfile/SpecialtiesCard';
import TreatmentStyleCard from '@/components/therapistProfile/TreatmentStyleCard';
import LocationCard from '@/components/therapistProfile/LocationCard';
import PersonalStatementCard from '@/components/therapistProfile/PersonalStatementCard';

// Import icons for breadcrumbs
import { Home, Users, MapPin as MapPinIcon, ChevronRight } from 'lucide-react';

// Slugify utility (ensure this is robust or use a library)
const slugify = (text: string | null | undefined): string =>
  text
    ? text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
    : '';

// Define the type for the therapist data more precisely
// This should encompass all fields used by child components and for JSON-LD
export type TherapistProfileData = NonNullable<Awaited<ReturnType<typeof getTherapistData>>>;

async function getTherapistData(slug: string) {
  return prisma.therapist.findUnique({
    where: { slug },
    // SELECT ALL FIELDS NEEDED BY ALL CHILD PROFILE CARDS AND JSON-LD
    select: {
      id: true,
      userId: true, // For claim status
      name: true,
      slug: true, // For OpenGraph URL
      tagline: true,
      imageUrl: true,
      phone: true,
      workEmail: true,
      website: true,
      primaryCredential: true,
      primaryCredentialAlt: true,
      profession: true,
      licenseStatus: true,
      licenseNumber: true,
      licenseState: true,
      // educationSchool, educationDegree, educationYearGraduated for QualificationsCard
      educationSchool: true,
      educationDegree: true,
      educationYearGraduated: true,
      practiceStartYear: true,
      // feeIndividual, feeCouples, slidingScale, freeConsultation, paymentMethods, insuranceAccepted, feeComment for FinancesCard
      feeIndividual: true,
      feeCouples: true,
      slidingScale: true,
      freeConsultation: true,
      paymentMethods: true,
      insuranceAccepted: true,
      feeComment: true,
      // issues, topIssues, specialtyDescription for SpecialtiesCard
      issues: true,
      topIssues: true, // Assuming you might use this for "Primary Focus Areas"
      specialtyDescription: true,
      // treatmentStyle, treatmentStyleDescription for TreatmentStyleCard
      treatmentStyle: true,
      treatmentStyleDescription: true,
      // Fields for LocationCard
      primaryAddress: true,
      primaryCity: true,
      primaryState: true,
      primaryZip: true,
      telehealth: true,
      inPerson: true,
      locationDescription: true,
      nearbyCity1: true,
      nearbyCity2: true,
      nearbyCity3: true,
      // Fields for PersonalStatementCard
      personalStatement1: true,
      personalStatement2: true,
      personalStatement3: true,
      published: true,
      // communities: true, // Add if you implement community badges
      // licenseExpirationMonth: true, // Add if needed by QualificationsCard
      // licenseExpirationYear: true,  // Add if needed by QualificationsCard
    },
  });
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata // Not strictly needed here but good practice if you were to extend
): Promise<Metadata> {
  await Promise.resolve(); // For searchParams/params access in newer Next.js versions (good habit)
  const slug = decodeURIComponent(params.slug);
  const therapist = await getTherapistData(slug);

  if (!therapist || !therapist.published) {
    return {
      title: 'Profile Not Found | TherapistDB',
      description: 'The therapist profile you are looking for could not be found.',
      robots: { index: false, follow: false } // Don't index not found pages
    };
  }

  const name = therapist.name || 'Therapist Profile';
  const credential = therapist.primaryCredential || '';
  const city = therapist.primaryCity || '';
  const state = therapist.primaryState || '';
  const locationPart = city && state ? `in ${city}, ${state}` : city ? `in ${city}` : state ? `in ${state}` : '';
  const mainSpecialty = therapist.issues && therapist.issues.length > 0 ? therapist.issues[0] : (therapist.profession || 'Mental Health Professional');

  const title = `${name}${credential ? `, ${credential}` : ''} - ${mainSpecialty} ${locationPart} | TherapistDB`.trim().replace(/ +/g, ' ');
  const description = `Find information about ${name}${credential ? `, ${credential}` : ''}, a ${mainSpecialty} ${locationPart ? `practicing ${locationPart}` : ''}. Specialties include ${therapist.issues?.slice(0, 3).join(', ')}. Contact them via TherapistDB.`;

  return {
    title,
    description,
    keywords: [
        therapist.name || '', therapist.primaryCredential || '', therapist.profession || '',
        'therapist', 'counselor', 'psychologist', therapist.primaryCity || '', therapist.primaryState || '',
        ...(therapist.issues || []), ...(therapist.treatmentStyle || [])
    ].filter(Boolean).map(k => k.trim()).filter(k => k.length > 1).slice(0,15), // Filter empty strings and ensure some length
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/therapists/${therapist.slug}`,
    },
    openGraph: {
      title, description, type: 'profile',
      profile: {
        firstName: therapist.name?.split(' ')[0],
        lastName: therapist.name?.split(' ').slice(1).join(' '),
        username: therapist.slug, // This should be unique identifier for OG, slug is good
      },
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/therapists/${therapist.slug}`,
      images: therapist.imageUrl ? [{ url: therapist.imageUrl, alt: `${therapist.name} - Profile Photo` }] : [],
    },
  };
}

export default async function TherapistProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  await Promise.resolve(); // Good practice for Server Components accessing params/searchParams
  const slug = decodeURIComponent(params.slug);
  const therapist = await getTherapistData(slug);

  if (!therapist || !therapist.published) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': therapist.profession === 'Psychiatrist' || therapist.primaryCredential === 'MD' ? 'Physician' : 'MedicalBusiness', // Or 'HealthAndBeautyBusiness' or 'ProfessionalService'
    name: therapist.name,
    image: therapist.imageUrl || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/therapists/${slug}`,
    telephone: therapist.phone || undefined,
    email: therapist.workEmail || undefined,
    description: therapist.tagline || therapist.personalStatement1 || `Learn more about ${therapist.name}, a ${therapist.profession || 'mental health professional'}.`,
    address: therapist.primaryAddress && therapist.primaryCity && therapist.primaryState && therapist.primaryZip ? {
      '@type': 'PostalAddress', 
      streetAddress: therapist.primaryAddress,
      addressLocality: therapist.primaryCity, 
      addressRegion: therapist.primaryState,
      postalCode: therapist.primaryZip, 
      addressCountry: 'US', // Assuming US, make dynamic if international
    } : undefined,
    ...(therapist.profession && { jobTitle: therapist.profession }),
    ...(therapist.insuranceAccepted && { makesOffer: { '@type': 'Offer', name: 'Accepts Insurance', description: `Accepts various insurance plans. Please verify coverage for: ${therapist.insuranceAccepted}` }}),
    medicalSpecialty: [...(therapist.profession ? [therapist.profession] : []), ...(therapist.issues || [])].filter(Boolean).join(', ') || undefined,
    availableService: [
        ...(therapist.telehealth ? [{ '@type': 'MedicalWebVisits', name: 'Telehealth Sessions' }] : []),
        ...(therapist.inPerson ? [{ '@type': 'MedicalClinic', name: 'In-Person Sessions' }] : []) // Assuming physical location implies clinic
    ].filter(Boolean), // Filter out undefined before checking length
  };
  // Clean up undefined/empty properties from jsonLd
  Object.keys(jsonLd).forEach(key => {
    const K = key as keyof typeof jsonLd;
    if (jsonLd[K] === undefined || (Array.isArray(jsonLd[K]) && (jsonLd[K] as unknown[]).length === 0)) {
      delete jsonLd[K];
    }
  });
  if (jsonLd.address && Object.keys(jsonLd.address).length === 0) delete jsonLd.address;


  return (
    <>
      <Script
        id="therapist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-100 min-h-screen print:bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">

          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 print:hidden">
            <ol className="list-none p-0 inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
              <li className="flex items-center">
                <Home size={14} className="mr-1.5 text-gray-500" />
                <Link href="/" className="hover:text-teal-700 hover:underline">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-gray-400 mx-0.5" />
                <Users size={14} className="mr-1.5 text-gray-500" />
                <Link href="/therapists" className="hover:text-teal-700 hover:underline">Therapists</Link>
              </li>
              {therapist.primaryState && (
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400 mx-0.5" />
                  <MapPinIcon size={14} className="mr-1.5 text-gray-500" />
                  <Link href={`/therapists?state=${slugify(therapist.primaryState)}`} className="hover:text-teal-700 hover:underline">
                    {therapist.primaryState}
                  </Link>
                </li>
              )}
              {therapist.primaryCity && therapist.primaryState && (
                 <li className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400 mx-0.5" />
                  <Link href={`/therapists?city=${slugify(therapist.primaryCity)}&state=${slugify(therapist.primaryState)}`} className="hover:text-teal-700 hover:underline">
                    {therapist.primaryCity}
                  </Link>
                </li>
              )}
              <li className="flex items-center text-gray-700 font-medium" aria-current="page">
                <ChevronRight size={16} className="text-gray-400 mx-0.5" />
                <span className="ml-1.5">{therapist.name || 'Therapist Profile'}</span>
              </li>
            </ol>
          </nav>

          <div className="space-y-6 md:space-y-8">
            {therapist.published && !therapist.userId && (
              <ClaimBanner therapistId={therapist.id} therapistName={therapist.name || 'this therapist'} />
            )}

            <ProfileHeader therapist={therapist as TherapistProfileData} />
            
            {/* Personal Statement Card - prioritized and potentially with more prominent styling */}
            {(therapist.personalStatement1 || therapist.tagline) && (
              <PersonalStatementCard
                title="My Therapeutic Philosophy & Approach" // Example of a more prominent title
                statements={[therapist.personalStatement1, therapist.personalStatement2, therapist.personalStatement3].filter(s => s && s.trim() !== '') as string[]}
                tagline={therapist.tagline}
              />
            )}
            
            <SpecialtiesCard therapist={therapist as TherapistProfileData} />
            <TreatmentStyleCard therapist={therapist as TherapistProfileData} />
            <LocationCard therapist={therapist as TherapistProfileData} />
            <FinancesCard therapist={therapist as TherapistProfileData} />
            <QualificationsCard therapist={therapist as TherapistProfileData} />

            {/* You could add other cards here, e.g., a map card, contact form card, etc. */}
          </div>
        </div>
      </div>
    </>
  );
}