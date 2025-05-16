// src/components/therapistProfile/PersonalStatementCard.tsx
import Card from '@/components/shared/Card';
import { BookOpenText } from 'lucide-react';

interface PersonalStatementCardProps {
  title?: string;
  tagline?: string | null;
  statements: (string | null | undefined)[];
}

export default function PersonalStatementCard({
  title = "My Therapeutic Philosophy & Approach", // More descriptive title
  tagline,
  statements,
}: PersonalStatementCardProps) {
  const validStatements = statements.filter(s => s && s.trim() !== '').map(s => s as string);
  const hasTagline = tagline && tagline.trim() !== '';
  const hasStatements = validStatements.length > 0;

  if (!hasTagline && !hasStatements) {
    return null;
  }

  return (
    <Card 
      title={title} 
      icon={<BookOpenText size={22} className="text-teal-700" />} // Slightly larger icon, more prominent color
      titleClassName="!text-xl sm:!text-2xl !font-bold !text-teal-700" // Emphasize card title
    >
      <div className="space-y-5"> {/* Increased spacing */}
        {hasTagline && (
          <blockquote className="border-l-4 border-teal-500 pl-4 py-2 my-1">
            <p className="italic text-gray-800 font-semibold text-lg sm:text-xl leading-tight"> {/* Larger tagline */}
              "{tagline}"
            </p>
          </blockquote>
        )}
        {hasStatements && (
          <div className="space-y-4 whitespace-pre-line text-gray-700 text-base sm:text-lg leading-relaxed sm:leading-loose"> {/* Larger base text & leading */}
            {validStatements.map((statement, index) => (
              <p key={index}>{statement}</p>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}