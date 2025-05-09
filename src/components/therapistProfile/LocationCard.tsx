import Card from '@/components/shared/Card'

export default function LocationCard({ therapist }: { therapist: any }) {
  const nearby = [therapist.nearbyCity1, therapist.nearbyCity2, therapist.nearbyCity3]
    .filter(Boolean)
    .join(', ')

  return (
    <Card title="Location">
      <p>
        {therapist.primaryCity || 'City'}, {therapist.primaryState || 'State'} {therapist.primaryZip || ''}
      </p>
      {therapist.locationDescription && (
        <p className="text-sm text-gray-600">{therapist.locationDescription}</p>
      )}
      {nearby && <p className="text-sm text-gray-500 mt-1">Also near: {nearby}</p>}
    </Card>
  )
}
