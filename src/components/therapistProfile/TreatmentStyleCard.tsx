// src/components/therapistProfile/TreatmentStyleCard.tsx
import Card from '@/components/shared/Card';
import Section from '@/components/shared/Section'; // Assuming Section exists
// Import all the icons you used in the modalityIcons map from 'lucide-react'
import {
  MessageSquare, HeartHandshake, Brain, Anchor, Zap, Users, User, Palette,
  BookOpen, Smile, ShieldCheck, Puzzle, Sparkles, Leaf, Waves, Repeat, Crosshair,
  Globe, Blend, PersonStanding, Lightbulb, MessageCircle, Focus, Heart, ToyBrick,
  Handshake, // <<< ADD Handshake HERE <<<
  Settings2 as CardIcon 
} from 'lucide-react';

// --- MODALITY ICONS MAP (Your full map goes here) ---
const modalityIcons: Record<string, React.ReactNode> = {
  "Cognitive Behavioral (CBT)": <MessageSquare size={14} className="mr-1.5 text-blue-600" />,
  "Trauma Focused": <Focus size={14} className="mr-1.5 text-red-600" />,
  "Strength-Based": <Smile size={14} className="mr-1.5 text-green-600" />,
  "Person-Centered": <User size={14} className="mr-1.5 text-purple-600" />,
  "Psychodynamic": <Brain size={14} className="mr-1.5 text-sky-600" />,
  "Mindfulness-Based (MBCT)": <Anchor size={14} className="mr-1.5 text-teal-600" />,
  "Attachment-based": <Handshake size={14} className="mr-1.5 text-pink-600" />, // This line was causing the error
  "Solution Focused Brief (SFBT)": <Lightbulb size={14} className="mr-1.5 text-yellow-500" />,
  "Culturally Sensitive": <Globe size={14} className="mr-1.5 text-indigo-600" />,
  "Motivational Interviewing": <MessageCircle size={14} className="mr-1.5 text-cyan-600" />,
  "Family Systems": <Puzzle size={14} className="mr-1.5 text-orange-600" />,
  "Humanistic": <Leaf size={14} className="mr-1.5 text-lime-600" />,
  "Dialectical Behavior (DBT)": <Repeat size={14} className="mr-1.5 text-rose-600" />,
  "Family / Marital": <Users size={14} className="mr-1.5 text-violet-600" />,
  "Relational": <HeartHandshake size={14} className="mr-1.5 text-red-500" />,
  "Interpersonal": <Users size={14} className="mr-1.5 text-purple-500" />,
  "Emotionally Focused": <Heart size={14} className="mr-1.5 text-pink-500" />,
  "Acceptance and Commitment (ACT)": <Anchor size={14} className="mr-1.5 text-emerald-600" />,
  "Narrative": <BookOpen size={14} className="mr-1.5 text-amber-600" />,
  "Compassion Focused": <HeartHandshake size={14} className="mr-1.5 text-red-400" />,
  "EMDR": <Zap size={14} className="mr-1.5 text-red-700" />,
  "Eclectic": <Blend size={14} className="mr-1.5 text-gray-500" />,
  "Multicultural": <Globe size={14} className="mr-1.5 text-indigo-500" />,
  "Coaching": <Sparkles size={14} className="mr-1.5 text-yellow-600" />,
  "Integrative": <Palette size={14} className="mr-1.5 text-gray-600" />,
  "Existential": <PersonStanding size={14} className="mr-1.5 text-lime-700" />,
  "Somatic": <Waves size={14} className="mr-1.5 text-blue-500" />,
  "Positive Psychology": <Smile size={14} className="mr-1.5 text-green-500" />,
  "Internal Family Systems (IFS)": <Puzzle size={14} className="mr-1.5 text-orange-500" />,
  "Play Therapy": <ToyBrick size={14} className="mr-1.5 text-pink-400" />,
};
// --- END OF MODALITY ICONS MAP ---

interface TreatmentStyleCardProps {
  therapist: {
    treatmentStyle?: string[] | null;
    treatmentStyleDescription?: string | null;
  };
}

export default function TreatmentStyleCard({ therapist }: TreatmentStyleCardProps) {
  const { treatmentStyle, treatmentStyleDescription } = therapist;
  const validStyles = treatmentStyle?.filter(s => s && s.trim() !== '') || [];

  const hasData = validStyles.length > 0 || (treatmentStyleDescription && treatmentStyleDescription.trim() !== '');
  if (!hasData) return null;

  return (
    <Card title="Therapeutic Approach & Modalities" icon={<CardIcon size={20} className="text-teal-600" />}>
      <div className="space-y-5">
        {validStyles.length > 0 && (
          <Section title="Modalities I Utilize" titleClassName="text-base font-medium text-gray-800 mb-2"> {/* Slightly more prominent sub-title */}
            <div className="flex flex-wrap gap-x-2.5 gap-y-2"> {/* Adjusted gap */}
              {validStyles.map(style => (
                <span
                  key={style}
                  className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors shadow-sm"
                  title={style}
                >
                  {modalityIcons[style] || <MessageSquare size={14} className="mr-1.5 text-gray-400" />}
                  {style}
                </span>
              ))}
            </div>
          </Section>
        )}

        {treatmentStyleDescription && treatmentStyleDescription.trim() !== '' && (
          <Section title="My Philosophy on Treatment" titleClassName="text-base font-medium text-gray-800 mb-1.5"> {/* Slightly more prominent sub-title */}
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{treatmentStyleDescription}</p>
          </Section>
        )}
      </div>
    </Card>
  );
}