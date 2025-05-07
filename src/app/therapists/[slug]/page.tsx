

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function TherapistProfilePage({ params }: { params: { slug: string } }) {
  const therapist = await prisma.therapist.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      userId: true,
      name: true,
      title: true,
      city: true,
      state: true,
      description: true,
      imageUrl: true,
      billing: true,
      languages: true,
      clientConcerns: true,
      groups: true,
      professions: true,
      licenseStatus: true,
      licenseNumber: true,
      licenseState: true,
      licenseExpiration: true,
      primaryCredential: true,
      credentials: true,
      mentalHealthRole: true,
      phone: true,
      primaryOffice: true,
      additionalOffice: true,
      telephone: true,
      fees: true,
      paymentMethods: true,
      insurance: true,
      npi: true,
      profInsurance: true,
      gender: true,
      faithOrientation: true,
      specialties: true,
      expertise: true,
      sexuality: true,
      availabilityNote: true,
      therapyTypes: true,
      therapyApproachNote: true,
      nearbyCities: true,
      nearbyNeighborhoods: true,
      locationNote: true,
      education: true,
      yearsInPractice: true
    },
  })

  if (!therapist) notFound()

  return (
    <div className="bg-[#F9FAF9] min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600">
          {therapist.state ?? 'Unknown State'} &gt; {therapist.city ?? 'Unknown City'} &gt; {therapist.name}
        </nav>

{/* Disclaimer & Claim CTA */}
{!therapist.userId && (
  <div className="bg-[#e6dbf9] border border-[#c9b8ec] text-sm text-gray-700 p-4 rounded-md">
    This profile for <strong>{therapist.name}</strong> was pulled from public data.
    If it’s yours you can{' '}
    <Link
      href={`/claim/${therapist.id}`}   // ← still passes the id
      className="underline text-purple-800"
    >
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
            <p className="text-sm text-gray-500">{therapist.title}</p>
            {therapist.description && (
              <p className="text-sm text-gray-700 mt-2 leading-relaxed max-w-md mx-auto">
                {therapist.description}
              </p>
            )}
          </div>
        </div>

        {/* Quick Facts */}
        <Card title="Quick Facts">
          <Fact label="Profession" value={therapist.professions} />
          <Fact label="Credential" value={therapist.primaryCredential} />
          <Fact label="Billing" value={therapist.billing} />
          <Fact label="Languages" value={therapist.languages?.join(', ')} />
          <Fact label="Groups" value={therapist.groups?.join(', ')} />
          <Fact label="Concerns Treated" value={therapist.clientConcerns?.join(', ')} />
        </Card>

        {/* About */}
        <Card title="About">{therapist.description}</Card>

        {/* Location */}
        <Card title="Location">
          <p>
            {therapist.city}, {therapist.state}
          </p>
          <p className="text-sm text-gray-600">{therapist.locationNote}</p>
        </Card>

        {/* Qualifications */}
        <Card title="Qualifications">
          <Fact label="License" value={therapist.licenseStatus} />
          <Fact label="Years in Practice" value={therapist.yearsInPractice} />
          <Fact label="Education" value={therapist.education} />
        </Card>

        {/* Specialties & Expertise */}
        <Card title="Specialties & Expertise">
          <Fact label="Specialties" value={therapist.specialties?.join(', ')} />
          <Fact label="Expertise" value={therapist.expertise?.join(', ')} />
          <Fact label="Sexuality" value={therapist.sexuality} />
        </Card>

        {/* Availability */}
        <Card title="Availability">{therapist.availabilityNote}</Card>

        {/* Treatment Preferences */}
        <Card title="Treatment Preferences">
          <Fact label="Therapy Types" value={therapist.therapyTypes?.join(', ')} />
          <p className="text-sm text-gray-600">{therapist.therapyApproachNote}</p>
        </Card>

        {/* Nearby Areas */}
        <Card title="Nearby Areas">
          <Fact label="Cities" value={therapist.nearbyCities?.join(', ')} />
          <Fact label="Neighborhoods" value={therapist.nearbyNeighborhoods?.join(', ')} />
        </Card>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="space-y-1 text-sm text-gray-800">{children}</div>
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
