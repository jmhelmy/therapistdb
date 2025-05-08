// src/app/therapists/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

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
      languages: true,
      issues: true,
      sexuality: true,
      treatmentStyle: true,
      treatmentStyleDescription: true,
      locationDescription: true,
      nearbyCity1: true,
      nearbyCity2: true,
      nearbyCity3: true,
      primaryCity: true,
      primaryState: true,
      primaryZip: true,
      specialtyDescription: true,
      published: true,
    },
  })

  if (!therapist || !therapist.published) notFound()

  const nearby = [therapist.nearbyCity1, therapist.nearbyCity2, therapist.nearbyCity3]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-[#F9FAF9] min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-2">
          California &gt; {therapist.primaryCity || 'City'} &gt; {therapist.name}
        </nav>

        {/* Claim notice */}
        {!therapist.userId && (
          <div className="bg-[#e6dbf9] border border-[#c9b8ec] text-sm text-gray-700 p-4 rounded-md">
            This profile was auto-generated from public data. If it’s yours, you can{' '}
            <Link href={`/claim/${therapist.id}`} className="underline text-purple-800">
              claim or edit it here
            </Link>.
          </div>
        )}

        {/* Header Card */}
        <div className="relative text-center border border-gray-100 shadow-sm rounded-md bg-white overflow-hidden">
          <div
            className="w-full h-32 rounded-t-md"
            style={{ background: 'linear-gradient(135deg, #efe3d0 0%, #f9f7f2 100%)' }}
          />
          {!therapist.userId && (
            <Link href={`/claim/${therapist.id}`}>
              <button className="absolute top-4 right-4 border border-gray-300 px-4 py-1 text-sm rounded-full bg-white hover:bg-gray-100">
                Claim profile
              </button>
            </Link>
          )}
          <div className="relative -mt-12">
            <div className="w-24 h-24 rounded-full mx-auto border-4 border-white bg-white overflow-hidden">
              <Image
                src={therapist.imageUrl || '/default-avatar.png'}
                alt={`${therapist.name} avatar`}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>
          <div className="pb-6 px-4 mt-2">
            <h1 className="text-xl font-semibold text-gray-900">{therapist.name}</h1>
            <p className="text-sm text-gray-500">
              {therapist.primaryCredential}
              {therapist.primaryCredentialAlt && `, ${therapist.primaryCredentialAlt}`}
            </p>
            {therapist.tagline && (
              <p className="text-sm text-gray-700 mt-2 max-w-md mx-auto">{therapist.tagline}</p>
            )}
            {therapist.phone && (
              <a
                href={`tel:${therapist.phone}`}
                className="inline-block mt-3 text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-full text-sm"
              >
                📞 {therapist.phone}
              </a>
            )}
            {therapist.website && (
              <a
                href={therapist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-block mt-3 border border-teal-600 text-teal-600 px-4 py-2 rounded-full text-sm hover:bg-teal-50"
              >
                website
              </a>
            )}
          </div>
        </div>

        {/* Finances */}
        <Card title="Finances">
          <Fact label="Individual Fee" value={therapist.feeIndividual} />
          <Fact label="Couples Fee" value={therapist.feeCouples} />
          {therapist.slidingScale && <p className="text-sm text-green-700">✅ Sliding Scale</p>}
          {therapist.freeConsultation && <p className="text-sm text-green-700">✅ Free Consultation</p>}
          <Fact label="Payment Methods" value={therapist.paymentMethods?.join(', ')} />
          <Fact label="Insurance" value={therapist.insuranceAccepted} />
          {therapist.feeComment && <p className="text-sm italic text-gray-500 mt-2">{therapist.feeComment}</p>}
        </Card>

        {/* Qualifications */}
        <Card title="Qualifications">
          <Fact label="License Status" value={therapist.licenseStatus} />
          <Fact label="License #" value={therapist.licenseNumber} />
          <Fact label="License State" value={therapist.licenseState} />
          <Fact
            label="License Exp."
            value={
              therapist.licenseExpirationMonth && therapist.licenseExpirationYear
                ? `${therapist.licenseExpirationMonth}/${therapist.licenseExpirationYear}`
                : undefined
            }
          />
          <Fact label="Education" value={therapist.educationSchool} />
          <Fact label="Degree" value={therapist.educationDegree} />
          <Fact label="Graduated" value={therapist.educationYearGraduated?.toString()} />
          <Fact label="Years in Practice" value={therapist.practiceStartYear?.toString()} />
        </Card>

        {/* Specialties & Issues */}
        <Card title="Specialties & Issues">
          <Fact label="Specialties" value={therapist.specialtyDescription} />
          <Fact label="Issues" value={therapist.issues?.join(', ')} />
          <Fact label="Sexuality" value={therapist.sexuality} />
        </Card>

        {/* Treatment Style */}
        {therapist.treatmentStyleDescription && (
          <Card title="Treatment Style">
            <p className="text-sm text-gray-800">{therapist.treatmentStyleDescription}</p>
          </Card>
        )}

        {/* Location */}
        <Card title="Location">
          <p>
            {therapist.primaryCity || 'City'}, {therapist.primaryState || 'State'} {therapist.primaryZip || ''}
          </p>
          {therapist.locationDescription && (
            <p className="text-sm text-gray-600">{therapist.locationDescription}</p>
          )}
          {nearby && <p className="text-sm text-gray-500 mt-1">Also near: {nearby}</p>}
        </Card>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="space-y-2 text-sm text-gray-800">{children}</div>
    </div>
  )
}

function Fact({ label, value }: { label: string; value?: string }) {
  return (
    <p>
      <span className="font-semibold text-gray-800">{label}:</span> {value || 'N/A'}
    </p>
  )
}
