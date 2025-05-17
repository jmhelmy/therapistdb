// src/app/dashboard/appointments/new/page.tsx

import AppointmentForm from '@/components/dashboard/appointments/AppointmentForm'; // We will create this component next
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI
import { Suspense } from 'react';

export const metadata = {
  title: 'Schedule New Appointment | TherapistDB',
};

export default function AddNewAppointmentPage() {
  // This page component will render the AppointmentForm.
  // It could also fetch necessary data to pass to the form, like a list of the therapist's clients
  // for a dropdown, but we can also handle that within AppointmentForm itself.

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          {/* Link back to a main calendar/appointments page, or client detail if coming from there */}
          <Link href="/dashboard/calendar"> {/* Placeholder: update if you have a different appointments overview page */}
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calendar
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 border-b pb-4">
          Schedule New Appointment
        </h1>
        {/*
          The AppointmentForm component will handle the form logic.
          For creating a new appointment, we don't pass any initialData.
          It will need to fetch the therapist's clients to populate a client selection dropdown.
        */}
        <Suspense fallback={<div className="text-center py-10">Loading form...</div>}>
          <AppointmentForm />
        </Suspense>
      </div>
    </div>
  );
}