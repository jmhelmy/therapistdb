// src/components/therapistProfile/SpecialtiesCard.tsx
import Card from '@/components/shared/Card';
import Section from '@/components/shared/Section';
// Import all the lucide-react icons used in specialtyVisuals
import {
  Zap, Heart, Brain, Users, User, Baby, Crosshair, Shield, BookOpen, Sun, Search,
  Briefcase, Palette, AlertTriangle, Link as LucideLink, ClipboardList, HeartCrack, Gauge,
  Target as CardIcon // Using Target as the main card icon
} from 'lucide-react';

// --- SPECIALTY VISUALS MAP (Paste the full map from the previous answer here) ---
const specialtyVisuals: Record<string, React.ReactNode> = {
  "Anxiety": "😟", "Depression": "😔", "Trauma and PTSD": <Zap size={16} className="mr-1.5 text-red-600" />, // Slightly larger icons for primary list
  "Relationship Issues": <Heart size={16} className="mr-1.5 text-pink-600" />, "Coping Skills": <BookOpen size={16} className="mr-1.5 text-blue-600" />,
  // ... (complete the map, potentially with slightly larger icons (size={16}) for primary list items)
  "Life Transitions": <Sun size={16} className="mr-1.5 text-yellow-500" />, "Grief": <Heart size={16} className="mr-1.5 text-gray-500" />,
  "Self Esteem": <Heart size={16} className="mr-1.5 text-rose-500" />, "Child": <Baby size={16} className="mr-1.5 text-sky-500" />,
  "Stress": <Zap size={16} className="mr-1.5 text-orange-500" />, "Addiction": <Crosshair size={16} className="mr-1.5 text-purple-600" />,
  "ADHD": <Crosshair size={16} className="mr-1.5 text-indigo-600" />, "Women's Issues": <User size={16} className="mr-1.5 text-pink-400" />,
  "Family Conflict": <Users size={16} className="mr-1.5 text-red-500" />, "Marital and Premarital": <Heart size={16} className="mr-1.5 text-red-400" />,
  "Parenting": <Users size={16} className="mr-1.5 text-green-500" />, "Mood Disorders": <Brain size={16} className="mr-1.5 text-blue-500" />,
  "LGBTQ+": "🏳️‍🌈", "Postpartum": <Baby size={16} className="mr-1.5 text-sky-400" />, "Prenatal": <Baby size={16} className="mr-1.5 text-sky-600" />,
  "Pregnancy": <Baby size={16} className="mr-1.5 text-sky-700" />, "Spirituality": <Sun size={16} className="mr-1.5 text-yellow-400" />,
  "Eating Disorders": <Crosshair size={16} className="mr-1.5 text-lime-600" />, "Men's Issues": <User size={16} className="mr-1.5 text-blue-400" />,
  "Substance Use": <Crosshair size={16} className="mr-1.5 text-purple-500" />, "Life Coaching": <Briefcase size={16} className="mr-1.5 text-teal-500" />,
  "Obsessive-Compulsive (OCD)": <Brain size={16} className="mr-1.5 text-indigo-500" />, "Anger Management": <Zap size={16} className="mr-1.5 text-red-700" />,
  "Codependency": <LucideLink size={16} className="mr-1.5 text-orange-600" />, "Behavioral Issues": <ClipboardList size={16} className="mr-1.5 text-gray-600" />,
  "Sex Therapy": <Heart size={16} className="mr-1.5 text-rose-600" />, "Autism": <Palette size={16} className="mr-1.5 text-teal-400" />,
  "Testing and Evaluation": <Search size={16} className="mr-1.5 text-gray-700" />, "Chronic Illness": <Gauge size={16} className="mr-1.5 text-blue-700" />,
  "Sexual Abuse": <AlertTriangle size={16} className="mr-1.5 text-red-800" />, "Divorce": <HeartCrack size={16} className="mr-1.5 text-gray-700" />,
  "Racial Identity": <Shield size={16} className="mr-1.5 text-yellow-700" />, "Bipolar Disorder": <Brain size={16} className="mr-1.5 text-purple-700" />,
  "Emotional Disturbance": <Brain size={16} className="mr-1.5 text-orange-700" />, "Infidelity": <HeartCrack size={16} className="mr-1.5 text-red-800" />,
};
// --- END OF SPECIALTY VISUALS MAP ---


interface SpecialtiesCardProps {
  therapist: {
    issues?: string[] | null;
    topIssues?: string[] | null; // Field for "flagged" key specialties
    specialtyDescription?: string | null;
  };
}

export default function SpecialtiesCard({ therapist }: SpecialtiesCardProps) {
  const { issues, topIssues, specialtyDescription } = therapist;

  const primaryFocusIssues = topIssues?.filter(issue => issue && issue.trim() !== '') || 
                             issues?.filter(issue => issue && issue.trim() !== '').slice(0, 3) || []; // Use topIssues or fallback

  const additionalIssues = (issues || []).filter(issue => issue && issue.trim() !== '' && !primaryFocusIssues.includes(issue));

  const hasData = primaryFocusIssues.length > 0 || additionalIssues.length > 0 || (specialtyDescription && specialtyDescription.trim() !== '');

  if (!hasData) return null;

  return (
    <Card title="Areas of Focus & Expertise" icon={<CardIcon size={20} className="text-teal-600" />}>
      <div className="space-y-5">
        {specialtyDescription && specialtyDescription.trim() !== '' && (
          <Section title="My Approach to Client Concerns" titleClassName="text-base font-medium text-gray-800 mb-1.5">
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{specialtyDescription}</p>
          </Section>
        )}

        {primaryFocusIssues.length > 0 && (
          <Section title="Primary Focus Areas" titleClassName="text-base font-medium text-gray-800 mb-2">
            <ul className="space-y-2"> {/* Increased spacing for primary list items */}
              {primaryFocusIssues.map(issue => (
                <li key={issue} className="flex items-center text-sm text-gray-800">
                  <span className="inline-flex h-6 w-6 items-center justify-center mr-2.5 shrink-0"> {/* Container for icon/emoji */}
                    {specialtyVisuals[issue] || <Brain size={16} className="text-gray-400" />}
                  </span>
                  <span className="font-medium text-gray-700">{issue}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {additionalIssues.length > 0 && (
          <Section title="Additional Areas of Experience" titleClassName="text-base font-medium text-gray-800 mb-2">
            <div className="flex flex-wrap gap-2">
                {additionalIssues.map(issue => (
                    <span 
                        key={issue} 
                        className="inline-flex items-center bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 hover:bg-slate-200 transition-colors"
                        title={issue}
                    >
                        {/* For pills, icons might make them too busy, consider text only or very small emojis */}
                        {/* {specialtyVisuals[issue] && typeof specialtyVisuals[issue] !== 'string' ? React.cloneElement(specialtyVisuals[issue] as React.ReactElement, { size: 12, className: "mr-1" }) : specialtyVisuals[issue]} */}
                        {issue}
                    </span>
                ))}
            </div>
          </Section>
        )}
      </div>
    </Card>
  );
}