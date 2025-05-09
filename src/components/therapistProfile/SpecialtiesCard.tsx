// src/components/therapistProfile/SpecialtiesCard.tsx
import Card from '@/components/shared/Card'

export default function SpecialtiesCard({ therapist }: { therapist: any }) {
  // split the single string into an array
  const specialties = therapist.specialtyDescription
    ? therapist.specialtyDescription.split(',').map(s => s.trim())
    : []

  return (
    <Card title="Specialties & Expertise">
      {specialties.length > 0 && (
        <>
          <h4 className="font-semibold mb-1">Top Specialties</h4>
          <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
            {specialties.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      )}

      {therapist.issues?.length > 0 && (
        <>
          <h4 className="font-semibold mb-1">Issues</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {therapist.issues.map((i: string) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
