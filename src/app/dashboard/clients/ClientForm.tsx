// src/components/dashboard/clients/ClientForm.tsx
'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormValues } from '@/lib/schemas/ehrSchemas'; // Adjust path as needed
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI
import { Input } from '@/components/ui/input';   // Assuming Shadcn UI
import { Textarea } from '@/components/ui/textarea';// Assuming Shadcn UI
import { Checkbox } from '@/components/ui/checkbox';// Assuming Shadcn UI
import { Label } from '@/components/ui/label';   // Assuming Shadcn UI
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Save, AlertCircle } from 'lucide-react';

// Props for the form - will allow us to reuse for editing later
interface ClientFormProps {
  initialData?: Partial<ClientFormValues>; // For pre-filling the form in edit mode
  clientId?: string; // For identifying the client in edit mode
  onSuccess?: (client: ClientFormValues) => void; // Optional callback on successful submission
}

export default function ClientForm({ initialData, clientId, onSuccess }: ClientFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditMode = !!clientId;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData || {
      // Default values for new client form
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: null, // Important: RHF likes null for optional dates if using <input type="date">
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      intakeFormCompleted: false,
      preferredName: '',
      pronouns: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
    },
  });

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    setIsLoading(true);
    setFormError(null);

    // Ensure dateOfBirth is either a valid date string or null, not an empty string
    // RHF might pass empty string if input type="date" is cleared.
    // The Zod preprocess should handle this, but an explicit check can be good.
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
    };

    try {
      const url = isEditMode ? `/api/clients/${clientId}` : '/api/clients';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Failed to ${isEditMode ? 'update' : 'create'} client`);
      }

      // alert(`Client ${isEditMode ? 'updated' : 'created'} successfully!`); // Or use a toast notification
      if (onSuccess) {
        onSuccess(responseData); // Pass the created/updated client data
      } else {
        // Default behavior: redirect to client list or the client's detail page
        router.push(isEditMode ? `/dashboard/clients/${clientId}` : '/dashboard/clients');
        router.refresh(); // Refresh server components on the target page
      }
      if (!isEditMode) {
        reset(); // Clear form after successful creation
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} client:`, error);
      setFormError(error.message || `An unexpected error occurred.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for consistent styling - you might have your own Field component
  const FieldWrapper: React.FC<{ label: string; htmlFor: string; error?: string; children: React.ReactNode; helperText?: string }> = ({ label, htmlFor, error, children, helperText }) => (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className={error ? "text-red-600" : "text-gray-700"}>{label}</Label>
      {children}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
      {formError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md relative flex items-center" role="alert">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <FieldWrapper label="First Name*" htmlFor="firstName" error={errors.firstName?.message}>
          <Input id="firstName" {...register('firstName')} placeholder="e.g., Jane" />
        </FieldWrapper>

        <FieldWrapper label="Last Name*" htmlFor="lastName" error={errors.lastName?.message}>
          <Input id="lastName" {...register('lastName')} placeholder="e.g., Doe" />
        </FieldWrapper>

        <FieldWrapper label="Preferred Name" htmlFor="preferredName" error={errors.preferredName?.message}>
          <Input id="preferredName" {...register('preferredName')} placeholder="e.g., Janie" />
        </FieldWrapper>

        <FieldWrapper label="Pronouns" htmlFor="pronouns" error={errors.pronouns?.message}>
          <Input id="pronouns" {...register('pronouns')} placeholder="e.g., she/her, they/them" />
        </FieldWrapper>
      </div>

      <div className="border-t border-gray-200 pt-6 sm:pt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <FieldWrapper label="Email Address" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} placeholder="e.g., jane.doe@example.com" />
        </FieldWrapper>

        <FieldWrapper label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" {...register('phone')} placeholder="e.g., (555) 123-4567" />
        </FieldWrapper>

        <FieldWrapper label="Date of Birth" htmlFor="dateOfBirth" error={errors.dateOfBirth?.message}>
          {/* For RHF with type="date", value needs to be in 'yyyy-MM-dd' or null/undefined */}
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <Input
                id="dateOfBirth"
                type="date"
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
        </FieldWrapper>
      </div>

      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Address (Optional)</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <FieldWrapper label="Address Line 1" htmlFor="addressLine1" error={errors.addressLine1?.message}>
                <Input id="addressLine1" {...register('addressLine1')} />
                </FieldWrapper>
            </div>
            <div className="sm:col-span-2">
                <FieldWrapper label="Address Line 2" htmlFor="addressLine2" error={errors.addressLine2?.message}>
                <Input id="addressLine2" {...register('addressLine2')} />
                </FieldWrapper>
            </div>
            <FieldWrapper label="City" htmlFor="city" error={errors.city?.message}>
                <Input id="city" {...register('city')} />
            </FieldWrapper>
            <FieldWrapper label="State / Province" htmlFor="state" error={errors.state?.message}>
                <Input id="state" {...register('state')} />
            </FieldWrapper>
            <FieldWrapper label="ZIP / Postal Code" htmlFor="zipCode" error={errors.zipCode?.message}>
                <Input id="zipCode" {...register('zipCode')} />
            </FieldWrapper>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Emergency Contact (Optional)</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <FieldWrapper label="Contact Name" htmlFor="emergencyContactName" error={errors.emergencyContactName?.message}>
                <Input id="emergencyContactName" {...register('emergencyContactName')} />
            </FieldWrapper>
            <FieldWrapper label="Contact Phone" htmlFor="emergencyContactPhone" error={errors.emergencyContactPhone?.message}>
                <Input id="emergencyContactPhone" type="tel" {...register('emergencyContactPhone')} />
            </FieldWrapper>
            <div className="sm:col-span-2">
                <FieldWrapper label="Relationship to Client" htmlFor="emergencyContactRelationship" error={errors.emergencyContactRelationship?.message}>
                    <Input id="emergencyContactRelationship" {...register('emergencyContactRelationship')} />
                </FieldWrapper>
            </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <FieldWrapper label="" htmlFor="intakeFormCompleted" error={errors.intakeFormCompleted?.message}>
            <div className="flex items-center">
                <Controller
                    name="intakeFormCompleted"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                        id="intakeFormCompleted"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mr-2"
                        />
                    )}
                />
                <Label htmlFor="intakeFormCompleted" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Intake form completed?
                </Label>
            </div>
        </FieldWrapper>
      </div>


      <div className="pt-8 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/clients')} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditMode ? 'Save Changes' : 'Add Client'}
        </Button>
      </div>
    </form>
  );
}