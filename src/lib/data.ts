import { locations } from '@/data/locations'
import { specialties } from '@/data/specialties'

type Specialty = {
  id: string
  name: string
  slug: string
}

type Location = {
  id: string
  city: string
  citySlug: string
  neighborhood?: string
  neighborhoodSlug?: string
  zipCodes: string[]
}

export function getSpecialtyBySlug(slug: string): Specialty | undefined {
  return specialties.find((s) => s.slug === slug)
}

export function getLocationData(
  citySlug: string,
  neighborhoodSlug?: string
): Location | undefined {
  return locations.find(
    (loc) =>
      loc.citySlug === citySlug &&
      (!neighborhoodSlug || loc.neighborhoodSlug === neighborhoodSlug)
  )
}

export function resolveZipToLocation(zip: string): Location | undefined {
  return locations.find((loc) =>
    loc.zipCodes.includes(zip)
  )
}
