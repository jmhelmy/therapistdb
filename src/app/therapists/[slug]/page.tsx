// src/app/therapists/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import ClaimBanner from '@/components/therapistProfile/ClaimBanner'
import ProfileHeader from '@/components/therapistProfile/ProfileHeader'
import FinancesCard from '@/components/therapistProfile/FinancesCard'
import QualificationsCard from '@/components/therapistProfile/QualificationsCard'
import SpecialtiesCard from '@/components/therapistProfile/SpecialtiesCard'
import TreatmentStyleCard from '@/components/therapistProfile/TreatmentStyleCard'
import LocationCard from '@/components/therapistProfile/LocationCard'

export default async function TherapistProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = decodeURIComponent(params.slug)

  const therapist = await prisma.therapist.findUnique({
    where: { slug },
    select: {
      id: true,
      userId: true,
      name: true,
      tagline: true,
      imageUrl: true,
      phone: true,
      workEmail: true,
      website: true,
      primaryCredential: true,
      primaryCredentialAlt: true,
      licenseStatus: true,
      licenseNumber: true,
      licenseState: true,
      licenseExpirationMonth: true,
      licenseExpirationYear: true,
      educationSchool: true,
      educationDegree: true,
      educationYearGraduated: true,
      practiceStartYear: true,
      feeIndividual: true,
      feeCouples: true,
      slidingScale: true,
      freeConsultation: true,
      paymentMethods: true,
      insuranceAccepted: true,
      feeComment: true,
      specialtyDescription: true,
      issues: true,
      sexuality: true,
      treatmentStyleDescription: true,
      locationDescription: true,
      nearbyCity1: true,
      nearbyCity2: true,
      nearbyCity3: true,
      primaryCity: true,
      primaryState: true,
      primaryZip: true,
      published: true,
    },
  })

  if (!therapist || !therapist.published) notFound()

  return (
    <div className="bg-[#F9FAF9] min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-2">
          California &gt; {therapist.primaryCity || 'City'} &gt; {therapist.name}
        </nav>

        {/* Only show when unclaimed */}
        {!therapist.userId && <ClaimBanner id={therapist.id} />}

        {/* Header with avatar, name, CTAs */}
        <ProfileHeader therapist={therapist} />

        {/* All the info cards */}
        <FinancesCard therapist={therapist} />
        <QualificationsCard therapist={therapist} />
        <SpecialtiesCard therapist={therapist} />
        <TreatmentStyleCard therapist={therapist} />
        <LocationCard therapist={therapist} />
      </div>
    </div>
  )
}
