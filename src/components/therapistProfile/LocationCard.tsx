// src/components/therapistProfile/LocationCard.tsx
import Card from '@/components/shared/Card';
import { MapPin, Video, Users, Globe2 } from 'lucide-react'; 
import Section from '@/components/shared/Section';

interface LocationCardProps {
  therapist: {
    primaryAddress?: string | null;
    primaryCity?: string | null;
    primaryState?: string | null;
    primaryZip?: string | null;
    locationDescription?: string | null;
    nearbyCity1?: string | null;
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
  const nearbyCities = [nearbyCity1, nearbyCity2, nearbyCity3].filter(city => city && city.trim() !== '').join(' / ');

  if (!hasPrimaryLocation && !locationDescription && !nearbyCities && telehealth === undefined && inPerson === undefined) {
    return null;
  }

  const fullAddress = [primaryAddress, primaryCity, primaryState, primaryZip].filter(Boolean).join(', ');
  const mapLink = hasPrimaryLocation ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;

  return (
    <Card title="Practice & Availability" icon={<MapPin size={20} className="text-teal-600" />}>
      <div className="space-y-5 text-base">
        {(telehealth || inPerson) && ( // Moved session types to the top as they are primary
            <Section title="Session Types Offered" titleClassName="text-base font-semibold text-gray-700 mb-1.5">
                <div className="space-y-1.5">
                    {telehealth && (
                        <p className="flex items-center text-gray-700">
                            <Video size={18} className="mr-2.5 shrink-0 text-teal-600"/> Offers Telehealth / Online Sessions
                        </p>
                    )}
                    {inPerson && (
                        <p className="flex items-center text-gray-700">
                            <Users size={18} className="mr-2.5 shrink-0 text-blue-600"/> Offers In-Person Sessions
                        </p>
                    )}
                </div>
            </Section>
        )}
        
        {hasPrimaryLocation && (
          <Section title="Office Location" titleClassName="text-base font-semibold text-gray-700 mb-1.5">
            <div className="text-gray-700">
              {primaryAddress && <p>{primaryAddress}</p>}
              <p>{primaryCity && `${primaryCity}, `}{primaryState && `${primaryState} `}{primaryZip && primaryZip}</p>
              {mapLink && (
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-xs text-teal-600 hover:underline"
                  >
                    Get Directions <Globe2 size={12} className="ml-1"/>
                  </a>
              )}
            </div>
          </Section>
        )}

        {locationDescription && locationDescription.trim() !== '' && (
          <Section title="About My Office" titleClassName="text-base font-semibold text-gray-700 mb-1.5">
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{locationDescription}</p>
          </Section>
        )}

        {nearbyCities && (
          <Section title="Also Serving Nearby Areas" titleClassName="text-base font-semibold text-gray-700 mb-1.5">
            <p className="text-gray-600">{nearbyCities}</p>
          </Section>
        )}
         
         {!hasPrimaryLocation && !telehealth && !inPerson && ( // If no location and no session types
            <p className="text-gray-500 italic">Service location and types not specified. Please contact for more information.</p>
         )}
      </div>
    </Card>
  );
}