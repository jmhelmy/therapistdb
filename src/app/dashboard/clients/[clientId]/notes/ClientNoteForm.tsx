// src/components/dashboard/notes/ClientNoteForm.tsx
'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  clientNoteSchema,
  ClientNoteFormValues,
  NOTE_TYPE_OPTIONS,
} from '@/lib/schemas/ehrSchemas'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';   // For Date of Service
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Save, AlertCircle, FileText } from 'lucide-react';

interface ClientNoteFormProps {
  clientId: string; // Required to associate the note with a client
  clientName?: string; // Optional, for display purposes
  initialData?: Partial<ClientNoteFormValues>;
  noteId?: string; // For identifying the note in edit mode
  onSuccess?: (note: ClientNoteFormValues) => void;
}

export default function ClientNoteForm({
  clientId,
  clientName,
  initialData,
  noteId,
  onSuccess,
}: ClientNoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditMode = !!noteId;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ClientNoteFormValues>({
    resolver: zodResolver(clientNoteSchema),
    defaultValues: initialData || {
      clientId: clientId, // Pre-fill clientId for new notes
      noteType: NOTE_TYPE_OPTIONS[0], // Default to first option
      content: '',
      dateOfService: new Date(), // Default to today
      isLocked: false, // Should not be user-editable directly in create/edit form
    },
  });

  const onSubmit: SubmitHandler<ClientNoteFormValues> = async (data) => {
    setIsLoading(true);
    setFormError(null);

    const payload = {
      ...data,
      clientId: clientId, // Ensure clientId is always included
      dateOfService: new Date(data.dateOfService).toISOString(), // Format for API
    };

    try {
      const url = isEditMode ? `/api/notes/${noteId}` : '/api/notes';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Failed to ${isEditMode ? 'update' : 'create'} note`);
      }

      // alert(`Note ${isEditMode ? 'updated' : 'saved'} successfully!`);
      if (onSuccess) {
        onSuccess(responseData);
      } else {
        // Redirect to the client's main page or notes list page
        router.push(`/dashboard/clients/${clientId}`); // Or a dedicated notes tab for that client
        router.refresh();
      }
      if (!isEditMode) {
        reset({ // Reset form but keep clientId
            clientId: clientId,
            noteType: NOTE_TYPE_OPTIONS[0],
            content: '',
            dateOfService: new Date(),
            isLocked: false,
        });
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'saving'} note:`, error);
      setFormError(error.message || `An unexpected error occurred.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for consistent styling
  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm";
  const labelClassName = "block text-sm font-medium text-gray-700";

  // Function to format date for date input
  const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    // Format: YYYY-MM-DD
    return d.toISOString().split('T')[0];
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md relative flex items-center" role="alert">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      {/* Client Information (Display Only) */}
      {clientName && !isEditMode && ( // Only show for new notes if clientName is passed
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm text-gray-700">
            Creating note for: <span className="font-semibold">{clientName}</span>
          </p>
          {/* Hidden input to ensure clientId is part of the form data if needed,
              but it's better to add it to the payload directly in onSubmit.
              The Zod schema clientNoteSchema requires clientId.
              react-hook-form's defaultValues should handle setting it.
          */}
           <input type="hidden" {...register('clientId')} />
        </div>
      )}


      {/* Note Type */}
      <div>
        <Label htmlFor="noteType" className={`${labelClassName} ${errors.noteType ? 'text-red-600' : ''}`}>Note Type*</Label>
        <Controller
          name="noteType"
          control={control}
          rules={{ required: "Note type is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <SelectTrigger className={`${inputClassName} ${errors.noteType ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select a note type" />
              </SelectTrigger>
              <SelectContent>
                {NOTE_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.noteType && <p className="text-xs text-red-600 mt-1">{errors.noteType.message}</p>}
      </div>

      {/* Date of Service */}
      <div>
        <Label htmlFor="dateOfService" className={`${labelClassName} ${errors.dateOfService ? 'text-red-600' : ''}`}>Date of Service*</Label>
        <Controller
          name="dateOfService"
          control={control}
          render={({ field }) => (
            <Input
              id="dateOfService"
              type="date"
              className={`${inputClassName} ${errors.dateOfService ? 'border-red-500' : ''}`}
              value={formatDateForInput(field.value)}
              onChange={(e) => field.onChange(e.target.valueAsDate)} // e.target.valueAsDate directly gives Date object or null
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
        {errors.dateOfService && <p className="text-xs text-red-600 mt-1">{errors.dateOfService.message}</p>}
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="content" className={`${labelClassName} ${errors.content ? 'text-red-600' : ''}`}>Note Content*</Label>
        <Textarea
          id="content"
          {...register('content')}
          rows={10}
          className={`${inputClassName} min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
          placeholder="Enter clinical note details here..."
        />
        {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>}
      </div>
      
      {/* isLocked field is usually not set by user during creation/edit, but shown if in edit mode */}
       {isEditMode && initialData?.isLocked && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
          Note: This note is locked and cannot be edited further. (The form should be disabled if so)
        </div>
      )}


      <div className="pt-8 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/clients/${clientId}`)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || (isEditMode && initialData?.isLocked)} className="min-w-[150px]">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditMode ? 'Save Note Changes' : 'Save Note'}
        </Button>
      </div>
    </form>
  );
}