// src/components/therapistProfile/PersonalStatementCard.tsx
import Card from '@/components/shared/Card'; // Assuming you have this shared Card component
import { BookOpenText } from 'lucide-react'; // Example icon

interface PersonalStatementCardProps {
  title?: string;
  tagline?: string | null;
  statements: string[]; // Array of personal statement parts
}

export default function PersonalStatementCard({
  title = "About Me", // Default title
  tagline,
  statements,
}: PersonalStatementCardProps) {
  const hasTagline = tagline && tagline.trim() !== '';
  const hasStatements = statements && statements.some(s => s && s.trim() !== '');

  if (!hasTagline && !hasStatements) {
    return null; // Don't render if there's no content
  }

  return (
    <Card title={title} icon={<BookOpenText className="w-5 h-5 mr-2" />}>
      <div className="space-y-4 text-sm text-gray-700">
        {hasTagline && (
          <p className="italic text-gray-800 font-medium text-md">
            "{tagline}"
          </p>
        )}
        {hasStatements && (
          <div className="space-y-3 whitespace-pre-line">
            {statements.map((statement, index) => (
              statement && statement.trim() !== '' && <p key={index}>{statement}</p>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}