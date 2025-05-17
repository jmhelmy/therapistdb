// src/app/dashboard/clients/[clientId]/edit/page.tsx

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ClientForm from '@/components/dashboard/clients/ClientForm'; // Your reusable form component
import { notFound } from 'next/navigation';
import { ArrowLeft, UserCog } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface EditClientDetailsPageProps {
  params: {
    clientId?: string;
  };
}

// Function to generate metadata dynamically
export async function generateMetadata({ params }: EditClientDetailsPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !params.clientId) {
    return { title: 'Edit Client Details | TherapistDB' };
  }

  const therapist = await prisma.therapist.findUnique({ where: { userId: session.user.id }, select: { id: true } });
  if (!therapist) return { title: 'Edit Client Details | TherapistDB' };

  const client = await prisma.client.findUnique({
    where: { id: params.clientId, therapistId: therapist.id },
    select: { firstName: true, lastName: true },
  });

  if (!client) {
    return { title: 'Client Not Found | TherapistDB' };
  }
  return { title: `Edit Details for ${client.firstName} ${client.lastName} | TherapistDB` };
}


export default async function EditClientDetailsPage({ params }: EditClientDetailsPageProps) {
  const { clientId } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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
    console.error("EditClientDetailsPage: Therapist profile not found for logged-in user.");
    return <p className="text-center text-red-600 py-10">Therapist profile not found.</p>;
  }

  // Fetch the specific client's data
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
      therapistId: therapist.id, // Ensure client belongs to this therapist
    },
  });

  if (!client) {
    notFound(); // Client not found or doesn't belong to this therapist
  }

  // Prepare initialData for the ClientForm.
  // Ensure dateOfBirth is correctly formatted if your form expects a string or Date object.
  // Prisma returns Date objects for DateTime fields.
  const initialDataForForm = {
    ...client,
    // Ensure all fields expected by ClientFormValues are present and correctly typed.
    // Most optional fields should be handled correctly by spreading `client` if they are null/undefined.
    phone: client.phone ?? undefined,
    email: client.email ?? undefined,
    addressLine1: client.addressLine1 ?? undefined,
    addressLine2: client.addressLine2 ?? undefined,
    city: client.city ?? undefined,
    state: client.state ?? undefined,
    zipCode: client.zipCode ?? undefined,
    preferredName: client.preferredName ?? undefined,
    pronouns: client.pronouns ?? undefined,
    emergencyContactName: client.emergencyContactName ?? undefined,
    emergencyContactPhone: client.emergencyContactPhone ?? undefined,
    emergencyContactRelationship: client.emergencyContactRelationship ?? undefined,
    // intakeFormCompleted is boolean
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          {/* Link back to the client's detail page */}
          <Link href={`/dashboard/clients/${clientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client Profile ({client.firstName} {client.lastName})
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6 sm:mb-8 border-b pb-4">
            <UserCog className="h-7 w-7 text-teal-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Edit Details for {client.firstName} {client.lastName}
            </h1>
        </div>
        
        <ClientForm
          initialData={initialDataForForm}
          clientId={client.id} // Pass clientId to indicate edit mode
        />
      </div>
    </div>
  );
}