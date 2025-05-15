// src/components/therapistProfile/LocationCard.tsx
import Card from '@/components/shared/Card';
import { MapPin, Video, Users } from 'lucide-react'; // Icons

interface LocationCardProps {
  therapist: {
    primaryAddress?: string | null; // Added for completeness if needed for a map link
    primaryCity?: string | null;
    primaryState?: string | null;
    primaryZip?: string | null;
    locationDescription?: string | null;
    nearbyCity1?: string | null; // Assuming these are fetched
    nearbyCity2?: string | null;
    nearbyCity3?: string | null;
    telehealth?: boolean | null;
    inPerson?: boolean | null;
  };
}

export default function LocationCard({ therapist }: LocationCardProps) {
  const {
    primaryAddress, primaryCity, primaryState, primaryZip,
    locationDescription, nearbyCity1, nearbyCity2, nearbyCity3,
    telehealth, inPerson
  } = therapist;

  const hasPrimaryLocation = primaryCity || primaryState || primaryZip;
  const nearbyCities = [nearbyCity1, nearbyCity2, nearbyCity3].filter(Boolean).join(', ');

  // Only render card if there's some location info or service type
  if (!hasPrimaryLocation && !locationDescription && !nearbyCities && telehealth === undefined && inPerson === undefined) {
    return null;
  }

  const fullAddress = [primaryAddress, primaryCity, primaryState, primaryZip].filter(Boolean).join(', ');
  // Simple Google Maps link (replace with more robust solution if needed)
  const mapLink = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;


  return (
    <Card title="Practice Location & Availability" icon={<MapPin className="w-5 h-5 mr-2"/>}>
      <div className="space-y-3 text-sm">
        {hasPrimaryLocation && (
          <div>
            <p className="font-medium text-gray-800">
              {primaryCity && `${primaryCity}, `}{primaryState && `${primaryState} `}{primaryZip && primaryZip}
            </p>
            {primaryAddress && <p className="text-gray-600">{primaryAddress}</p>}
            {mapLink && (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-600 hover:underline"
                >
                  View on map
                </a>
            )}
          </div>
        )}

        {locationDescription && (
          <p className="text-gray-600 pt-1 border-t border-gray-100 mt-2">{locationDescription}</p>
        )}

        {nearbyCities && (
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-medium">Also serving:</span> {nearbyCities}
          </p>
        )}

        {(telehealth !== undefined || inPerson !== undefined) && (
            <div className="pt-3 border-t border-gray-100 mt-3 space-y-1">
                {telehealth && (
                    <p className="flex items-center text-green-700">
                        <Video size={16} className="mr-2 shrink-0"/> Offers Telehealth Sessions
                    </p>
                )}
                 {inPerson && (
                    <p className="flex items-center text-blue-700">
                        <Users size={16} className="mr-2 shrink-0"/> Offers In-Person Sessions
                    </p>
                )}
            </div>
        )}
         {!hasPrimaryLocation && telehealth === false && inPerson === false && (
            <p className="text-gray-500 italic">Location details not specified. Please contact for more information.</p>
         )}
      </div>
    </Card>
  );
}