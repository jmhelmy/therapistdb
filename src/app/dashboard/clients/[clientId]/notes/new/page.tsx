// src/app/dashboard/clients/[clientId]/notes/new/page.tsx

import ClientNoteForm from '@/components/dashboard/notes/ClientNoteForm'; // We will create this component next
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { ArrowLeft, FilePlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface AddClientNotePageProps {
  params: {
    clientId?: string;
  };
}

// Function to generate metadata dynamically
export async function generateMetadata({ params }: AddClientNotePageProps): Promise<Metadata> {
  if (!params.clientId) {
    return { title: 'Add New Note | TherapistDB' };
  }
  // Optional: Fetch client name for a more specific title
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { title: 'Add New Note | TherapistDB' };

  const therapist = await prisma.therapist.findUnique({ where: { userId: session.user.id }, select: {id: true}});
  if (!therapist) return { title: 'Add New Note | TherapistDB' };

  const client = await prisma.client.findUnique({
    where: { id: params.clientId, therapistId: therapist.id },
    select: { firstName: true, lastName: true }
  });

  if (client) {
    return { title: `Add Note for ${client.firstName} ${client.lastName} | TherapistDB` };
  }
  return { title: 'Add New Note | TherapistDB' };
}


export default async function AddClientNotePage({ params }: AddClientNotePageProps) {
  const { clientId } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Or redirect to login
    return <p className="text-center text-red-600 py-10">Unauthorized. Please log in.</p>;
  }

  if (!clientId) {
    notFound(); // Should not happen if route is matched correctly
  }

  // Verify client exists and belongs to the therapist before allowing note creation
  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!therapist) {
    console.error("AddClientNotePage: Therapist profile not found for logged-in user.");
    return <p className="text-center text-red-600 py-10">Therapist profile not found.</p>;
  }

  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
      therapistId: therapist.id, // Ensure client belongs to this therapist
    },
    select: { id: true, firstName: true, lastName: true } // Select only needed fields
  });

  if (!client) {
    notFound(); // Client not found or doesn't belong to this therapist
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          {/* Link back to the specific client's detail/notes page */}
          <Link href={`/dashboard/clients/${clientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client Profile ({client.firstName} {client.lastName})
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6 sm:mb-8 border-b pb-4">
            <FilePlus className="h-7 w-7 text-teal-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Add New Note for {client.firstName} {client.lastName}
            </h1>
        </div>
        {/*
          The ClientNoteForm component will handle the form logic.
          We pass the clientId to it so it knows which client the note is for.
        */}
        <ClientNoteForm clientId={client.id} clientName={`${client.firstName} ${client.lastName}`} />
      </div>
    </div>
  );
}