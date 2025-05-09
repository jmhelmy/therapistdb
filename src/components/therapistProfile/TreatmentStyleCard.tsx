// src/components/therapistProfile/TreatmentStyleCard.tsx
import Card from '@/components/shared/Card'

export default function TreatmentStyleCard({ therapist }: { therapist: any }) {
  if (!therapist.treatmentStyleDescription) return null

  return (
    <Card title="Treatment Style">
      <p className="text-sm whitespace-pre-line">{therapist.treatmentStyleDescription}</p>
    </Card>
  )
}
