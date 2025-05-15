// src/components/therapistProfile/SpecialtiesCard.tsx
import Card from '@/components/shared/Card';
import { Brain } from 'lucide-react'; // Example icon

interface SpecialtiesCardProps {
  therapist: {
    issues?: string[] | null; // This is your primary array of specialties/issues
    topIssues?: string[] | null; // If you persist this from the profile builder
    specialtyDescription?: string | null; // Free-text description
     // Other arrays like mentalHealthInterests, communities, etc. could be displayed here too
  };
}

export default function SpecialtiesCard({ therapist }: SpecialtiesCardProps) {
  const { issues, topIssues, specialtyDescription } = therapist;

  const hasData = (issues && issues.length > 0) ||
                  (topIssues && topIssues.length > 0) ||
                  (specialtyDescription && specialtyDescription.trim() !== '');

  if (!hasData) return null;

  return (
    <Card title="Specialties & Client Focus" icon={<Brain className="w-5 h-5 mr-2"/>}>
      <div className="space-y-4 text-sm">
        {specialtyDescription && specialtyDescription.trim() !== '' && (
          <div>
            {/* <h4 className="font-semibold text-gray-800 mb-1">Approach to Specialties</h4> */}
            <p className="text-gray-700 whitespace-pre-line">{specialtyDescription}</p>
          </div>
        )}

        {/* Display Top Issues if available and distinct */}
        {topIssues && topIssues.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-1.5">Primary Focus Areas:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {topIssues.map(issue => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Display all other issues if available */}
        {issues && issues.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-1.5 mt-3">Also Experienced With:</h4>
            <div className="flex flex-wrap gap-2">
                {issues.filter(issue => !(topIssues || []).includes(issue)) // Filter out already listed top issues
                       .map(issue => (
                    <span key={issue} className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {issue}
                    </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}