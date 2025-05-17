// src/components/dashboard/appointments/AppointmentForm.tsx
'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  appointmentSchema,
  AppointmentFormValues,
  APPOINTMENT_STATUS_OPTIONS,
  APPOINTMENT_TYPE_OPTIONS,
  APPOINTMENT_LOCATION_TYPE_OPTIONS
} from '@/lib/schemas/ehrSchemas'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Shadcn UI Select
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, AlertCircle, CalendarPlus } from 'lucide-react';

// Define a simple Client type for the dropdown
interface ClientMin {
  id: string;
  firstName: string;
  lastName: string;
}

interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormValues>;
  appointmentId?: string; // For identifying the appointment in edit mode
  onSuccess?: (appointment: AppointmentFormValues) => void;
}

export default function AppointmentForm({ initialData, appointmentId, onSuccess }: AppointmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientMin[]>([]);
  const [isFetchingClients, setIsFetchingClients] = useState(true);

  const isEditMode = !!appointmentId;

  // Fetch clients for the dropdown
  useEffect(() => {
    const fetchClientsForTherapist = async () => {
      setIsFetchingClients(true);
      try {
        const response = await fetch('/api/clients'); // GET request to list therapist's clients
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data: ClientMin[] = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients for appointment form:", error);
        setFormError("Could not load client list. Please try again later.");
      } finally {
        setIsFetchingClients(false);
      }
    };
    fetchClientsForTherapist();
  }, []);

  // Set default start/end times for new appointments
  const getDefaultStartEndTime = () => {
    const now = new Date();
    const defaultStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0); // Next hour, on the hour
    const defaultEndTime = new Date(defaultStartTime.getTime() + 60 * 60 * 1000); // 1 hour later
    return { defaultStartTime, defaultEndTime };
  };

  const { defaultStartTime, defaultEndTime } = getDefaultStartEndTime();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData || {
      clientId: '',
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      appointmentType: APPOINTMENT_TYPE_OPTIONS[0], // Default to first option
      status: APPOINTMENT_STATUS_OPTIONS[0],       // Default to "Scheduled"
      locationType: APPOINTMENT_LOCATION_TYPE_OPTIONS[0],
      locationDetails: '',
      isTelehealth: false,
      privateNotes: '',
    },
  });

  const onSubmit: SubmitHandler<AppointmentFormValues> = async (data) => {
    setIsLoading(true);
    setFormError(null);

    // Ensure dates are correctly formatted if necessary, though Zod preprocess should handle it.
    // The API expects full ISO strings if your Prisma schema is DateTime.
    const payload = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    };

    try {
      const url = isEditMode ? `/api/appointments/${appointmentId}` : '/api/appointments';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Failed to ${isEditMode ? 'update' : 'schedule'} appointment`);
      }

      // alert(`Appointment ${isEditMode ? 'updated' : 'scheduled'} successfully!`);
      if (onSuccess) {
        onSuccess(responseData);
      } else {
        router.push(isEditMode ? `/dashboard/appointments/${appointmentId}` : '/dashboard/calendar'); // Redirect to calendar or appt detail
        router.refresh();
      }
      if (!isEditMode) {
        reset(); // Clear form after successful creation
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'scheduling'} appointment:`, error);
      setFormError(error.message || `An unexpected error occurred.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for input field styling - adapt to your design system
  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm";
  const labelClassName = "block text-sm font-medium text-gray-700";


  // Function to format date for datetime-local input
  const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    // Format: YYYY-MM-DDTHH:mm
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    const hours = (`0${d.getHours()}`).slice(-2);
    const minutes = (`0${d.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md relative flex items-center" role="alert">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      {/* Client Selection */}
      <div>
        <Label htmlFor="clientId" className={`${labelClassName} ${errors.clientId ? 'text-red-600' : ''}`}>Client*</Label>
        {isFetchingClients ? (
          <div className="flex items-center mt-1">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-gray-500" />
            <span className="text-sm text-gray-500">Loading clients...</span>
          </div>
        ) : clients.length > 0 ? (
          <Controller
            name="clientId"
            control={control}
            rules={{ required: "Client selection is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger className={`${inputClassName} ${errors.clientId ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <p className="mt-1 text-sm text-gray-500">No clients found. <Link href="/dashboard/clients/new" className="text-teal-600 hover:underline">Add a client first</Link>.</p>
        )}
        {errors.clientId && <p className="text-xs text-red-600 mt-1">{errors.clientId.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        {/* Start Time */}
        <div>
          <Label htmlFor="startTime" className={`${labelClassName} ${errors.startTime ? 'text-red-600' : ''}`}>Start Time*</Label>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <Input
                id="startTime"
                type="datetime-local"
                className={`${inputClassName} ${errors.startTime ? 'border-red-500' : ''}`}
                value={formatDateForInput(field.value)}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
              />
            )}
          />
          {errors.startTime && <p className="text-xs text-red-600 mt-1">{errors.startTime.message}</p>}
        </div>

        {/* End Time */}
        <div>
          <Label htmlFor="endTime" className={`${labelClassName} ${errors.endTime ? 'text-red-600' : ''}`}>End Time*</Label>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <Input
                id="endTime"
                type="datetime-local"
                className={`${inputClassName} ${errors.endTime ? 'border-red-500' : ''}`}
                value={formatDateForInput(field.value)}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
              />
            )}
          />
          {errors.endTime && <p className="text-xs text-red-600 mt-1">{errors.endTime.message}</p>}
        </div>
      </div>
      {/* Custom error for time range from Zod .refine() */}
      {errors.root?.serverError && errors.root.serverError.type === 'manual' && errors.root.serverError.message.includes("End time must be after start time") && (
         <p className="text-xs text-red-600 mt-1">{errors.root.serverError.message}</p>
      )}


      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        {/* Appointment Type */}
        <div>
          <Label htmlFor="appointmentType" className={labelClassName}>Appointment Type</Label>
          <Controller
            name="appointmentType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPE_OPTIONS.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.appointmentType && <p className="text-xs text-red-600 mt-1">{errors.appointmentType.message}</p>}
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" className={labelClassName}>Status</Label>
           <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        {/* Location Type */}
        <div>
          <Label htmlFor="locationType" className={labelClassName}>Location Type</Label>
           <Controller
            name="locationType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_LOCATION_TYPE_OPTIONS.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationType && <p className="text-xs text-red-600 mt-1">{errors.locationType.message}</p>}
        </div>

        {/* Location Details */}
        <div>
            <Label htmlFor="locationDetails" className={labelClassName}>Location Details</Label>
            <Input id="locationDetails" {...register('locationDetails')} className={inputClassName} placeholder="e.g., Office Room 3, or specific video link if not auto-generated"/>
            {errors.locationDetails && <p className="text-xs text-red-600 mt-1">{errors.locationDetails.message}</p>}
        </div>
      </div>

        {/* Is Telehealth */}
        <div className="flex items-center space-x-2 pt-2">
             <Controller
                name="isTelehealth"
                control={control}
                render={({ field }) => (
                    <Checkbox
                        id="isTelehealth"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
            <Label htmlFor="isTelehealth" className="text-sm font-medium text-gray-700 cursor-pointer">
                This is a telehealth appointment
            </Label>
            {errors.isTelehealth && <p className="text-xs text-red-600 ml-2">{errors.isTelehealth.message}</p>}
        </div>

      {/* Private Notes */}
      <div>
        <Label htmlFor="privateNotes" className={labelClassName}>Private Notes (for therapist only)</Label>
        <Textarea
          id="privateNotes"
          {...register('privateNotes')}
          rows={3}
          className={inputClassName}
          placeholder="Logistical notes about this appointment, e.g., client requested to discuss XYZ."
        />
        {errors.privateNotes && <p className="text-xs text-red-600 mt-1">{errors.privateNotes.message}</p>}
      </div>


      <div className="pt-8 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isFetchingClients} className="min-w-[160px]">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CalendarPlus className="mr-2 h-4 w-4" />
          )}
          {isEditMode ? 'Save Appointment Changes' : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  );
}