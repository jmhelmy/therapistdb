// src/components/therapistAccount/build-profile/tabs/clientMagnetAI/components/SuggestionCard.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react'; // Example icons

interface SuggestionCardProps {
  title: string;
  content: string;
  onCopy?: () => void;
  onUse?: () => void;
}

export default function SuggestionCard({ title, content, onCopy, onUse }: SuggestionCardProps) {
  return (
    <div className="p-4 bg-white rounded-md shadow border border-gray-200">
      <h5 className="font-semibold text-gray-700 mb-1">{title}</h5>
      <p className="text-sm text-gray-600 whitespace-pre-line">{content}</p>
      <div className="mt-3 space-x-2">
        {onCopy && <Button variant="outline" size="sm" onClick={onCopy}><Copy size={14} className="mr-1" /> Copy</Button>}
        {onUse && <Button variant="ghost" size="sm" onClick={onUse} className="text-teal-600"><CheckCircle size={14} className="mr-1" /> Use this</Button>}
      </div>
    </div>
  );
}