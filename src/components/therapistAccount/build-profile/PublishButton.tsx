// src/components/therapistAccount/build-profile/PublishButton.tsx
'use client'

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FullTherapistProfile } from '@/lib/schemas/therapistSchema'; // Adjust path

export default function PublishButton() {
  const [loading, setLoading] = useState(false);
  const { watch, setValue, getValues } = useFormContext<FullTherapistProfile>();

  const therapistId = watch('id');
  const therapistName = watch('name');
  const isPublished = watch('published');

  const handlePublish = async () => {
    if (!therapistId || !therapistName?.trim()) {
      alert('Therapist must have an ID and a name before publishing.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/therapists/publish', { // Ensure this API exists
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: therapistId, name: therapistName }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(`Publish failed: ${json.message || 'Unknown error'}`);
        return;
      }
      const updatedSlug = json.slug || getValues('slug'); // Use getValues for current slug if not returned
      console.log('✅ Published with slug:', updatedSlug);
      setValue('published', true, { shouldDirty: true, shouldValidate: true });
      setValue('slug', updatedSlug, { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      console.error('❌ Publish error:', err);
      alert('An error occurred while publishing.');
    } finally {
      setLoading(false);
    }
  };

  if (isPublished) return null; // Or show "Published" status differently in BuildProfileHeader

  return (
    <button
      type="button" // Important: prevent form submission if it's inside the main <form>
      onClick={handlePublish}
      disabled={!therapistId || !therapistName?.trim() || loading}
      className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition disabled:opacity-50"
    >
      {loading ? 'Publishing…' : 'Publish'}
    </button>
  );
}