// src/components/dashboard/appointments/AppointmentList.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2, AlertTriangle, CalendarClock, PlusCircle } from 'lucide-react';

// Define an interface for the appointment data expected from the API
interface ClientMinForAppointment {
  id: string;
  firstName: string;
  lastName: string;
}

interface AppointmentListItem {
  id: string;
  startTime: string | Date; // API might return string, convert to Date for formatting
  endTime: string | Date;
  appointmentType?: string | null;
  status?: string | null;
  client: ClientMinForAppointment | null;
}

interface AppointmentListProps {
  clientId?: string; // <<< KEY CHANGE: Optional prop to filter by client
  // You might add other props for default date ranges if needed
}

export default function AppointmentList({ clientId }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for date range filters if you implement UI controls for them
  // const [startDate, setStartDate] = useState<string>('');
  // const [endDate, setEndDate] = useState<string>('');

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (clientId) {
        queryParams.append('clientId', clientId); // <<< KEY CHANGE: Add clientId to query if provided
      }
      // Example for date filters (if you add them)
      // if (startDate) queryParams.append('startDate', startDate);
      // if (endDate) queryParams.append('endDate', endDate);
      
      const apiUrl = `/api/appointments?${queryParams.toString()}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch appointments: ${response.statusText}`);
      }
      const data: AppointmentListItem[] = await response.json();
      setAppointments(data);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [clientId]); // <<< KEY CHANGE: Add clientId to dependency array

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    // Set a more specific loading state if needed, or manage within button
    // setIsLoading(true); // This would set global loading, maybe too broad for a single delete
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete appointment: ${response.statusText}`);
      }
      fetchAppointments(); // Re-fetch appointments to update the list
      alert('Appointment deleted successfully.'); // Or use a toast notification
    } catch (err: any) {
      console.error("Error deleting appointment:", err);
      // setError(err.message || "Failed to delete appointment."); // Avoid setting global error for action failure
      alert(`Error: ${err.message || "Failed to delete appointment."}`);
    } finally {
      // setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (isLoading && appointments.length === 0) { // Show loader only on initial load
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <p className="ml-3 text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-3" />
          <div>
            <p className="font-bold">Error Loading Appointments</p>
            <p>{error} <Button variant="link" size="sm" onClick={fetchAppointments} className="p-0 h-auto text-red-700 hover:text-red-900">Try again</Button></p>
          </div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <CalendarClock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {clientId ? "No appointments found for this client." : "No appointments scheduled."}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {clientId ? "Schedule a new appointment for this client." : "Get started by scheduling your first appointment."}
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href={clientId ? `/dashboard/appointments/new?clientId=${clientId}` : "/dashboard/appointments/new"}>
              <PlusCircle className="mr-2 h-5 w-5" /> Schedule New Appointment
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <ul role="list" className="divide-y divide-gray-200">
        {appointments.map((appt) => (
          <li key={appt.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-teal-600">
                  {appt.appointmentType || 'Appointment'}
                  {/* Only show 'with Client Name' if clientId prop is NOT provided (i.e., general list) */}
                  {!clientId && appt.client && ` with ${appt.client.firstName} ${appt.client.lastName}`}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">When:</span> {formatDate(appt.startTime)} - {new Date(appt.endTime).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className="font-medium">{appt.status || 'N/A'}</span>
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-2">
                <Button variant="outline" size="sm" asChild title="View/Edit Appointment">
                  <Link href={`/dashboard/appointments/${appt.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button
                  variant="destructiveOutline"
                  size="sm"
                  onClick={() => handleDeleteAppointment(appt.id)}
                  // disabled={isLoading} // Consider a more granular loading state for individual deletes
                  title="Delete Appointment"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* TODO: Implement pagination controls if API supports it */}
    </div>
  );
}