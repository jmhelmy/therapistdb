// src/app/therapists/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import Script from 'next/script';

import ClaimBanner from '@/components/therapistProfile/ClaimBanner';
import ProfileHeader from '@/components/therapistProfile/ProfileHeader';
import FinancesCard from '@/components/therapistProfile/FinancesCard';
import QualificationsCard from '@/components/therapistProfile/QualificationsCard';
import SpecialtiesCard from '@/components/therapistProfile/SpecialtiesCard';
import TreatmentStyleCard from '@/components/therapistProfile/TreatmentStyleCard';
import LocationCard from '@/components/therapistProfile/LocationCard';
import PersonalStatementCard from '@/components/therapistProfile/PersonalStatementCard'; // Ensure this component exists

// Helper function to generate a slug (if not already in utils)
const slugify = (text: string | null | undefined): string =>
  text ? text.toLowerCase().replace(/\s+/g, '-') : '';

// Define the type for the therapist data selected
// This should encompass all fields used by child components and for JSON-LD
// (Assuming TherapistProfileData type is defined as before, based on getTherapistData select)
type TherapistProfileData = NonNullable<Awaited<ReturnType<typeof getTherapistData>>>;


async function getTherapistData(slug: string) {
  return prisma.therapist.findUnique({
    where: { slug },
    select: {
      // ... (keep your comprehensive select statement from the previous version)
      id: true, userId: true, name: true, tagline: true, imageUrl: true, phone: true,
      workEmail: true, website: true, primaryCredential: true, primaryCredentialAlt: true,
      profession: true, licenseStatus: true, licenseNumber: true, licenseState: true,
      educationSchool: true, educationDegree: true, practiceStartYear: true,
      feeIndividual: true, feeCouples: true, slidingScale: true, freeConsultation: true,
      paymentMethods: true, insuranceAccepted: true, feeComment: true, issues: true,
      specialtyDescription: true, treatmentStyle: true, treatmentStyleDescription: true,
      primaryAddress: true, primaryCity: true, primaryState: true, primaryZip: true,
      telehealth: true, inPerson: true, locationDescription: true,
      personalStatement1: true, personalStatement2: true, personalStatement3: true,
      published: true,
      // Add any other fields needed by your cards or JSON-LD
      // e.g., coverImageUrl, licenseExpirationMonth/Year, educationYearGraduated,
      // nearbyCity1/2/3, sexuality, etc. if you use them.
    },
  });
}

// ... (generateMetadata function remains the same as the previous version) ...
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const therapist = await getTherapistData(slug);

  if (!therapist || !therapist.published) {
    return {
      title: 'Profile Not Found | TherapistDB',
      description: 'The therapist profile you are looking for could not be found.',
    };
  }

  const name = therapist.name || 'Therapist Profile';
  const credential = therapist.primaryCredential || '';
  const city = therapist.primaryCity || 'Their City';
  const state = therapist.primaryState || 'Their State';
  const mainSpecialty = therapist.issues && therapist.issues.length > 0 ? therapist.issues[0] : (therapist.profession || 'Mental Health Professional');

  const title = `${name}, ${credential} - ${mainSpecialty} in ${city}, ${state} | TherapistDB`;
  const description = `Find information about ${name}, ${credential}, a ${mainSpecialty} practicing in ${city}, ${state}. Specialties include ${therapist.issues?.slice(0, 3).join(', ')}. Contact them via TherapistDB.`;

  return {
    title,
    description,
    keywords: [
        therapist.name || '', therapist.primaryCredential || '', therapist.profession || '',
        'therapist', 'counselor', 'psychologist', city, state,
        ...(therapist.issues || []), ...(therapist.treatmentStyle || [])
    ].filter(Boolean).slice(0,15),
    openGraph: {
      title, description, type: 'profile',
      profile: {
        firstName: therapist.name?.split(' ')[0],
        lastName: therapist.name?.split(' ').slice(1).join(' '),
        username: therapist.slug,
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
  const slug = decodeURIComponent(params.slug);
  const therapist = await getTherapistData(slug);

  if (!therapist || !therapist.published) {
    notFound();
  }

  // ... (jsonLd object preparation remains the same as the previous version) ...
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': therapist.profession === 'Psychiatrist' || therapist.primaryCredential === 'MD' ? 'Physician' : 'MedicalBusiness',
    name: therapist.name,
    image: therapist.imageUrl || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/therapists/${slug}`,
    telephone: therapist.phone || undefined,
    email: therapist.workEmail || undefined,
    description: therapist.tagline || therapist.personalStatement1 || `Learn more about ${therapist.name}, a ${therapist.profession || 'mental health professional'}.`,
    address: therapist.primaryAddress ? {
      '@type': 'PostalAddress', streetAddress: therapist.primaryAddress,
      addressLocality: therapist.primaryCity, addressRegion: therapist.primaryState,
      postalCode: therapist.primaryZip, addressCountry: 'US',
    } : undefined,
    ...(therapist.profession && { jobTitle: therapist.profession }),
    ...(therapist.insuranceAccepted && { makesOffer: { '@type': 'Offer', name: 'Accepts Insurance', description: therapist.insuranceAccepted }}),
    medicalSpecialty: [...(therapist.profession ? [therapist.profession] : []), ...(therapist.issues || [])].filter(Boolean).join(', ') || undefined,
    availableService: [
        ...(therapist.telehealth ? [{ '@type': 'MedicalWebVisits', name: 'Telehealth Sessions' }] : []),
        ...(therapist.inPerson ? [{ '@type': 'MedicalClinic', name: 'In-Person Sessions' }] : [])
    ],
  };
  Object.keys(jsonLd).forEach(key => jsonLd[key as keyof typeof jsonLd] === undefined && delete jsonLd[key as keyof typeof jsonLd]);
  if (jsonLd.address && Object.keys(jsonLd.address).length === 0) delete jsonLd.address;
  if (jsonLd.availableService && jsonLd.availableService.length === 0) delete jsonLd.availableService;


  return (
    <>
      <Script
        id="therapist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-50 min-h-screen px-4 py-8 sm:py-10 print:bg-white">
        {/* Max width container for the entire profile content */}
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-gray-500 mb-2 print:hidden">
            <ol className="list-none p-0 inline-flex flex-wrap space-x-1.5"> {/* Added flex-wrap */}
              <li className="flex items-center">
                <Link href="/" className="hover:text-teal-600 hover:underline">Home</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-1">/</span>
                <Link href="/therapists" className="hover:text-teal-600 hover:underline">Therapists</Link>
              </li>
              {therapist.primaryState && (
                <li className="flex items-center">
                  <span className="mx-1">/</span>
                  <Link href={`/therapists?state=${slugify(therapist.primaryState)}`} className="hover:text-teal-600 hover:underline">
                    {therapist.primaryState}
                  </Link>
                </li>
              )}
              {therapist.primaryCity && (
                 <li className="flex items-center">
                  <span className="mx-1">/</span>
                  <Link href={`/therapists?city=${encodeURIComponent(therapist.primaryCity)}&state=${slugify(therapist.primaryState)}`} className="hover:text-teal-600 hover:underline">
                    {therapist.primaryCity}
                  </Link>
                </li>
              )}
              <li className="flex items-center text-gray-700 font-medium" aria-current="page"> {/* Last item styling */}
                <span className="mx-1">/</span>
                <span>{therapist.name || 'Therapist Profile'}</span>
              </li>
            </ol>
          </nav>

          {therapist.published && !therapist.userId && (
            <ClaimBanner therapistId={therapist.id} therapistName={therapist.name || 'this therapist'} />
          )}

          <ProfileHeader therapist={therapist as TherapistProfileData} />

          {/* All content cards will now stack vertically in this single column flow */}
          {/* You can adjust the order based on importance */}

          {(therapist.personalStatement1 || therapist.tagline) && (
            <PersonalStatementCard
              title="About Me" // Or a more dynamic title if preferred
              statements={[therapist.personalStatement1, therapist.personalStatement2, therapist.personalStatement3].filter(s => s && s.trim() !== '') as string[]}
              tagline={therapist.tagline}
            />
          )}

          <SpecialtiesCard therapist={therapist as TherapistProfileData} />
          <TreatmentStyleCard therapist={therapist as TherapistProfileData} />
          <LocationCard therapist={therapist as TherapistProfileData} />
          <FinancesCard therapist={therapist as TherapistProfileData} />
          <QualificationsCard therapist={therapist as TherapistProfileData} />

          {/* Optional: Section for user reviews/testimonials if you implement that */}
          {/* <ReviewsCard therapistId={therapist.id} /> */}

        </div>
      </div>
    </>
  );
}