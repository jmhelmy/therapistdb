// app/[country]/[state]/[county]/[city]/[neighborhood]/[[...zips]]/page.tsx
import { locations } from '@/data/locations'
import { services }  from '@/data/specialties'

export async function generateStaticParams() {
  const paramsList: Array<{
    country: string
    state: string
    county: string
    city: string
    neighborhood: string
    zips?: string[]
  }> = []

  for (const loc of locations) {
    // 1) push neighborhood‐only
    paramsList.push({
      country: loc.countrySlug,
      state:   loc.stateSlug,
      county:  loc.countySlug,
      city:    loc.citySlug,
      neighborhood: loc.neighborhoodSlug
    })

    // 2) push each zip individually (if you want zip pages)
    for (const zip of loc.zips) {
      paramsList.push({
        country: loc.countrySlug,
        state:   loc.stateSlug,
        county:  loc.countySlug,
        city:    loc.citySlug,
        neighborhood: loc.neighborhoodSlug,
        zips: [zip]
      })
    }
  }

  return paramsList
}
