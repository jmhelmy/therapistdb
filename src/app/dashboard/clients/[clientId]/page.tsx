// src/app/dashboard/clients/[clientId]/page.tsx

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, UserCircle, CalendarDays, FileTextIcon } from 'lucide-react';
import type { Metadata } from 'next';

// Import the list components we've created
import ClientNotesList from '@/components/dashboard/notes/ClientNotesList';
import AppointmentList from '@/components/dashboard/appointments/AppointmentList'; // We might need to adapt this or make a new version

interface ClientDetailPageProps {
  params: {
    clientId?: string;
  };
}

export async function generateMetadata({ params }: ClientDetailPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !params.clientId) {
    return { title: 'Client Details | TherapistDB' };
  }

  const therapist = await prisma.therapist.findUnique({ where: { userId: session.user.id }, select: { id: true } });
  if (!therapist) return { title: 'Client Details | TherapistDB' };

  const client = await prisma.client.findUnique({
    where: { id: params.clientId, therapistId: therapist.id },
    select: { firstName: true, lastName: true },
  });

  if (!client) {
    return { title: 'Client Not Found | TherapistDB' };
  }
  return { title: `${client.firstName} ${client.lastName} | Client Details | TherapistDB` };
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // For server components, redirecting or showing an error message directly
    // For client components, you'd use useRouter
    // Since this is a server component, we can redirect or throw error
    // For simplicity, let's assume auth protection is handled by middleware or higher layout
    // Or: redirect('/login');
    return <p className="text-center text-red-600 py-10">Unauthorized. Please log in.</p>;
  }

  if (!clientId) {
    notFound();
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!therapist) {
    console.error("ClientDetailPage: Therapist profile not found for logged-in user.");
    return <p className="text-center text-red-600 py-10">Therapist profile not found.</p>;
  }

  // Fetch the client with their notes and appointments
  // Note: This can become a larger query. Consider performance for many notes/appointments.
  // We are fetching them here server-side for initial render.
  // Alternatively, ClientNotesList and AppointmentList can do their own client-side fetching.
  // For this example, we'll fetch server-side.
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
      therapistId: therapist.id, // Crucial authorization check
    },
    // We are not including notes and appointments here directly
    // We will pass the clientId to the respective list components which will fetch their own data
    // This keeps this page component cleaner and allows those lists to have their own state (e.g., pagination)
  });

  if (!client) {
    notFound(); // Client not found or doesn't belong to this therapist
  }

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link href="/dashboard/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client List
          </Link>
        </Button>
      </div>

      {/* Client Summary Card */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <UserCircle className="h-16 w-16 text-teal-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {client.preferredName ? `${client.preferredName} (${client.firstName} ${client.lastName})` : `${client.firstName} ${client.lastName}`}
              </h1>
              {client.pronouns && <p className="text-sm text-gray-500">{client.pronouns}</p>}
            </div>
          </div>
          <Button asChild>
            <Link href={`/dashboard/clients/${client.id}/edit`}> {/* Link to the existing edit page */}
              <Edit className="mr-2 h-4 w-4" /> Edit Client Details
            </Link>
          </Button>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.email || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.phone || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(client.dateOfBirth)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {client.addressLine1 || ''} {client.addressLine2 || ''} <br />
                {client.city || ''}{client.city && client.state ? ', ' : ''}{client.state || ''} {client.zipCode || ''}
                {!client.addressLine1 && !client.city && 'N/A'}
              </dd>
            </div>
             <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Intake Completed</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.intakeFormCompleted ? 'Yes' : 'No'}</dd>
            </div>
            {/* Add more client details as needed */}
          </dl>
        </div>
      </div>

      {/* Section for Client Notes */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <ClientNotesList clientId={client.id} clientName={`${client.firstName} ${client.lastName}`} />
      </div>

      {/* Section for Client Appointments */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
                Appointments for {client.firstName} {client.lastName}
            </h3>
            <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/appointments/new?clientId=${client.id}&clientName=${encodeURIComponent(client.firstName + " " + client.lastName)}`}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Appointment
                </Link>
            </Button>
        </div>
        {/* The AppointmentList component will fetch appointments filtered by this clientId */}
        <AppointmentList clientId={client.id} />
      </div>
    </div>
  );
}