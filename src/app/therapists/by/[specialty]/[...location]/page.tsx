import { getSpecialtyBySlug, getLocationData } from '@/lib/data'
import TherapistCard from '@/components/therapistProfile/TherapistList/TherapistCard'
import { notFound } from 'next/navigation'

import { specialties } from '@/data/specialties'
import { locations } from '@/data/locations'

type Props = {
  params: {
    specialty: string
    location?: string[]
  }
}

export async function generateMetadata({ params }: Props) {
  const { specialty, location = [] } = params
  const specialtyData = await getSpecialtyBySlug(specialty)
  const locationData = await getLocationData(location[0], location[1])

  if (!specialtyData || !locationData) return {}

  const loc = locationData.neighborhood
    ? `${locationData.neighborhood}, ${locationData.city}`
    : locationData.city

  return {
    title: `${specialtyData.name} Therapists in ${loc}`,
    description: `Find trusted ${specialtyData.name} therapists near you in ${loc}. Book virtual or in-person sessions today.`
  }
}

export default async function SEOPage({ params }: Props) {
  const { specialty, location = [] } = params
  const specialtyData = await getSpecialtyBySlug(specialty)
  const locationData = await getLocationData(location[0], location[1])

  if (!specialtyData || !locationData) return notFound()

  const therapists = [] // placeholder

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">
        {specialtyData.name} Therapists in{' '}
        {locationData.neighborhood
          ? `${locationData.neighborhood}, ${locationData.city}`
          : locationData.city}
      </h1>
      <p className="mb-4 text-gray-700">
        Find in-network, virtual, and affordable options below.
      </p>
      {therapists.length === 0 ? (
        <p>No matching therapists found.</p>
      ) : (
        therapists.map((t) => <TherapistCard key={t.id} therapist={t} />)
      )}
    </div>
  )
}

export async function generateStaticParams() {
  const params = []

  for (const specialty of specialties) {
    for (const location of locations) {
      const zips = Array.isArray(location.zipCodes) ? location.zipCodes : []

      for (const zip of zips) {
        params.push({
          specialty: specialty.slug,
          location: [location.citySlug, zip]
        })
      }

      // Broader route without zip
      params.push({
        specialty: specialty.slug,
        location: [location.citySlug]
      })
    }
  }

  return params
}