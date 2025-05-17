// src/app/dashboard/clients/[clientId]/notes/[noteId]/page.tsx

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ClientNoteForm from '@/components/dashboard/notes/ClientNoteForm'; // Your reusable form component
import { notFound } from 'next/navigation';
import { ArrowLeft, FileEdit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface EditClientNotePageProps {
  params: {
    clientId?: string;
    noteId?: string;
  };
}

// Function to generate metadata dynamically
export async function generateMetadata({ params }: EditClientNotePageProps): Promise<Metadata> {
  const { clientId, noteId } = params;
  if (!clientId || !noteId) {
    return { title: 'Edit Note | TherapistDB' };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { title: 'Edit Note | TherapistDB' };

  const therapist = await prisma.therapist.findUnique({ where: { userId: session.user.id }, select: { id: true } });
  if (!therapist) return { title: 'Edit Note | TherapistDB' };

  const note = await prisma.clientNote.findUnique({
    where: {
      id: noteId,
      clientId: clientId,
      therapistId: therapist.id,
    },
    include: {
      client: { select: { firstName: true, lastName: true } },
    },
  });

  if (note && note.client) {
    return { title: `Edit Note for ${note.client.firstName} ${note.client.lastName} - ${new Date(note.dateOfService).toLocaleDateString()} | TherapistDB` };
  }
  return { title: 'Note Not Found | TherapistDB' };
}


export default async function EditClientNotePage({ params }: EditClientNotePageProps) {
  const { clientId, noteId } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p className="text-center text-red-600 py-10">Unauthorized. Please log in.</p>;
  }

  if (!clientId || !noteId) {
    notFound();
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!therapist) {
    console.error("EditClientNotePage: Therapist profile not found for logged-in user.");
    return <p className="text-center text-red-600 py-10">Therapist profile not found.</p>;
  }

  const note = await prisma.clientNote.findUnique({
    where: {
      id: noteId,
      clientId: clientId,         // Ensure note belongs to the specified client
      therapistId: therapist.id, // Ensure note belongs to the logged-in therapist
    },
    include: {
      client: { select: { id: true, firstName: true, lastName: true } }, // For display context
    },
  });

  if (!note || !note.client) {
    notFound(); // Note not found or client association missing or doesn't belong to therapist
  }

  // Prepare initialData for the ClientNoteForm
  // Prisma returns Date objects for DateTime fields.
  // The ClientNoteForm's Controller for dateOfService expects a Date object or a parsable string.
  const initialDataForForm = {
    ...note,
    // Ensure all fields expected by ClientNoteFormValues are present.
    // For example, if noteType, content, or dateOfService could be null from DB (though unlikely based on schema),
    // provide appropriate fallbacks, or ensure Zod schema handles it.
    // Our Zod clientNoteSchema requires noteType, content, dateOfService.
    // clientId is already on the note object.
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          {/* Link back to the specific client's detail/notes page */}
          <Link href={`/dashboard/clients/${clientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes for {note.client.firstName} {note.client.lastName}
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6 sm:mb-8 border-b pb-4">
            <FileEdit className="h-7 w-7 text-teal-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Edit Note for {note.client.firstName} {note.client.lastName}
            </h1>
        </div>
        <p className="text-sm text-gray-500 mb-6 -mt-4">
            Date of Service: {new Date(note.dateOfService).toLocaleDateString()}
            {note.isLocked && <span className="ml-2 font-semibold text-amber-600">(This note is locked and cannot be modified)</span>}
        </p>

        <ClientNoteForm
          clientId={client.id} // Pass clientId
          clientName={`${note.client.firstName} ${note.client.lastName}`}
          initialData={initialDataForForm}
          noteId={note.id} // Pass noteId to indicate edit mode
        />
      </div>
    </div>
  );
}