// src/components/therapistProfile/PersonalStatementCard.tsx
import Card from '@/components/shared/Card';
import { BookOpenText } from 'lucide-react'; // Kept original icon color for now

interface PersonalStatementCardProps {
  title?: string;
  tagline?: string | null;
  statements: (string | null | undefined)[];
  // Removed accentColor prop
}

export default function PersonalStatementCard({
  title = "My Therapeutic Philosophy & Approach",
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
      icon={<BookOpenText size={22} className="text-teal-600" />} // Using teal for card icon for now
      titleClassName="!text-xl sm:!text-2xl !font-bold text-gray-800" // Standard dark title
    >
      <div className="space-y-5">
        {hasTagline && (
          <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-1"> {/* Neutral quote border */}
            {/* INCREASED FONT SIZE for tagline */}
            <p className="italic text-gray-700 font-medium text-lg sm:text-xl leading-tight"> 
              "{tagline}"
            </p>
          </blockquote>
        )}
        {hasStatements && (
          // INCREASED FONT SIZE for statements
          <div className="space-y-4 whitespace-pre-line text-gray-700 text-base sm:text-lg leading-relaxed sm:leading-loose">
            {validStatements.map((statement, index) => (
              <p key={index}>{statement}</p>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}