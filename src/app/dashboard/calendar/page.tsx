// src/app/dashboard/calendar/page.tsx
import { Suspense } from 'react';
import AppointmentList from '@/components/dashboard/appointments/AppointmentList'; // We'll create this next
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Calendar & Appointments | TherapistDB',
};

export default async function CalendarPage() {
  // This page will primarily host the AppointmentList component,
  // which will handle its own data fetching.
  // We could add date range selectors here that pass props to AppointmentList.

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <CalendarDays className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Schedule New Appointment
          </Link>
        </Button>
      </div>

      {/* TODO: Consider adding date range pickers or view toggles (week/month/list) here later.
        These could then pass props to AppointmentList to filter the data.
      */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
        This is a basic list view of your appointments. A full calendar view can be added later.
      </div>

      <Suspense fallback={<div className="text-center py-10">Loading appointments...</div>}>
        <AppointmentList />
      </Suspense>
    </div>
  );
}