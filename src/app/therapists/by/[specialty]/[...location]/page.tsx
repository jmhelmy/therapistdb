import { getSpecialtyBySlug, getLocationData, getTherapists } from '@/lib/data'
import TherapistCard from '@/components/TherapistCard'
import { notFound } from 'next/navigation'
import Head from 'next/head'

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

  const therapists = await getTherapists({
    specialty: specialtyData.id,
    locationId: locationData.id
  })

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
