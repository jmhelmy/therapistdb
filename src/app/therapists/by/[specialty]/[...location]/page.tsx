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
import PersonalStatementCard from '@/components/therapistProfile/PersonalStatementCard';
import { Home, Users, MapPin as MapPinIcon, ChevronRight } from 'lucide-react'; // For breadcrumbs

const slugify = (text: string | null | undefined): string =>
  text ? text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : '';

type TherapistProfileData = NonNullable<Awaited<ReturnType<typeof getTherapistData>>>;

async function getTherapistData(slug: string) {
  return prisma.therapist.findUnique({
    where: { slug },
    select: {
      id: true, userId: true, name: true, tagline: true, imageUrl: true, phone: true,
      workEmail: true, website: true, primaryCredential: true, primaryCredentialAlt: true,
      profession: true, licenseStatus: true, licenseNumber: true, licenseState: true,
      educationSchool: true, educationDegree: true, practiceStartYear: true,
      feeIndividual: true, feeCouples: true, slidingScale: true, freeConsultation: true,
      paymentMethods: true, insuranceAccepted: true, feeComment: true, issues: true,
      topIssues: true, // Assuming you fetch this
      specialtyDescription: true, treatmentStyle: true, treatmentStyleDescription: true,
      primaryAddress: true, primaryCity: true, primaryState: true, primaryZip: true,
      telehealth: true, inPerson: true, locationDescription: true,
      nearbyCity1: true, nearbyCity2: true, nearbyCity3: true, // Assuming you fetch these
      personalStatement1: true, personalStatement2: true, personalStatement3: true,
      published: true,
      // licenseExpirationMonth: true, licenseExpirationYear: true, educationYearGraduated: true // Add if needed by QualificationsCard
    },
  });
}

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
    title, description,
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

export default async function TherapistProfilePage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const therapist = await getTherapistData(slug);

  if (!therapist || !therapist.published) {
    notFound();
  }

  const jsonLd = { /* ... your JSON-LD object ... */ }; // Keep your JSON-LD logic

  return (
    <>
      <Script
        id="therapist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-100 min-h-screen print:bg-white"> {/* Lighter background */}
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10"> {/* Slightly wider max-width */}

          {/* Breadcrumb with Icons */}
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 print:hidden">
            <ol className="list-none p-0 inline-flex flex-wrap items-center gap-1.5">
              <li className="flex items-center">
                <Home size={14} className="mr-1.5 text-gray-500" />
                <Link href="/" className="hover:text-teal-700 hover:underline">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
                <Users size={14} className="mx-1.5 text-gray-500" />
                <Link href="/therapists" className="hover:text-teal-700 hover:underline">Therapists</Link>
              </li>
              {therapist.primaryState && (
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <MapPinIcon size={14} className="mx-1.5 text-gray-500" />
                  <Link href={`/therapists?state=${slugify(therapist.primaryState)}`} className="hover:text-teal-700 hover:underline">
                    {therapist.primaryState}
                  </Link>
                </li>
              )}
              {therapist.primaryCity && therapist.primaryState && ( // Only show city if state is also present for context
                 <li className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link href={`/therapists?city=${encodeURIComponent(slugify(therapist.primaryCity))}&state=${slugify(therapist.primaryState)}`} className="hover:text-teal-700 hover:underline">
                    {therapist.primaryCity}
                  </Link>
                </li>
              )}
              <li className="flex items-center text-gray-700 font-medium" aria-current="page">
                <ChevronRight size={16} className="text-gray-400" />
                <span className="ml-1.5">{therapist.name || 'Therapist Profile'}</span>
              </li>
            </ol>
          </nav>

          <div className="space-y-6 md:space-y-8"> {/* Container for cards */}
            {therapist.published && !therapist.userId && (
              <ClaimBanner therapistId={therapist.id} therapistName={therapist.name || 'this therapist'} />
            )}

            <ProfileHeader therapist={therapist as TherapistProfileData} />
            
            {/* Order of cards can be adjusted for importance */}
            {(therapist.personalStatement1 || therapist.tagline) && (
              <PersonalStatementCard
                title="About Me"
                statements={[therapist.personalStatement1, therapist.personalStatement2, therapist.personalStatement3].filter(s => s && s.trim() !== '') as string[]}
                tagline={therapist.tagline}
              />
            )}
            <SpecialtiesCard therapist={therapist as TherapistProfileData} />
            <TreatmentStyleCard therapist={therapist as TherapistProfileData} />
            <LocationCard therapist={therapist as TherapistProfileData} />
            <FinancesCard therapist={therapist as TherapistProfileData} />
            <QualificationsCard therapist={therapist as TherapistProfileData} />
          </div>
        </div>
      </div>
    </>
  );
}