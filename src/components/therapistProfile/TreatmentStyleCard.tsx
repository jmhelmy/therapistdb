// src/components/therapistProfile/TreatmentStyleCard.tsx
import Card from '@/components/shared/Card';
import { Zap } from 'lucide-react'; // Example icon

interface TreatmentStyleCardProps {
  therapist: {
    treatmentStyle?: string[] | null; // Array of modalities
    treatmentStyleDescription?: string | null; // Free-text description
  };
}

export default function TreatmentStyleCard({ therapist }: TreatmentStyleCardProps) {
  const { treatmentStyle, treatmentStyleDescription } = therapist;

  const hasData = (treatmentStyle && treatmentStyle.length > 0) ||
                  (treatmentStyleDescription && treatmentStyleDescription.trim() !== '');

  if (!hasData) return null;

  return (
    <Card title="Therapeutic Approach" icon={<Zap className="w-5 h-5 mr-2"/>}>
      <div className="space-y-3 text-sm">
        {treatmentStyle && treatmentStyle.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-1.5">Modalities Used:</h4>
            <div className="flex flex-wrap gap-2">
              {treatmentStyle.map(style => (
                <span key={style} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}

        {treatmentStyleDescription && treatmentStyleDescription.trim() !== '' && (
          <div className={treatmentStyle && treatmentStyle.length > 0 ? "mt-3 pt-3 border-t border-gray-100" : ""}>
            {/* <h4 className="font-semibold text-gray-800 mb-1">My Approach:</h4> */}
            <p className="text-gray-700 whitespace-pre-line">{treatmentStyleDescription}</p>
          </div>
        )}
      </div>
    </Card>
  );
}