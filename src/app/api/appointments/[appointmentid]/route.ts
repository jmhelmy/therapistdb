// src/app/api/appointments/[appointmentId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { appointmentSchema } from '@/lib/schemas/ehrSchemas'; // Used for PUT validation
import { z } from 'zod';

interface RouteContext {
  params: {
    appointmentId?: string;
  };
}

// --- GET Handler (Fetch a specific appointment by ID) ---
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in.' }, { status: 401 });
    }

    const { appointmentId } = context.params;

    if (!appointmentId || typeof appointmentId !== 'string') {
      return NextResponse.json({ error: 'Appointment ID is required and must be a string.' }, { status: 400 });
    }

    // Optional: Validate if appointmentId is a CUID or UUID
    // try { z.string().cuid().parse(appointmentId); } catch (e) { return NextResponse.json({ error: 'Invalid Appointment ID format.' }, { status: 400 }); }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    if (appointment.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to this appointment.' }, { status: 403 });
    }

    return NextResponse.json(appointment, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching appointment ${context.params.appointmentId}:`, error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred while fetching the appointment." }, { status: 500 });
  }
}

// --- PUT Handler (Update a specific appointment by ID) ---
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { appointmentId } = context.params;

    if (!appointmentId || typeof appointmentId !== 'string') {
      return NextResponse.json({ error: 'Appointment ID is required and must be a string.' }, { status: 400 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    if (existingAppointment.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to update this appointment.' }, { status: 403 });
    }

    const requestBody = await req.json();
    // Use .partial() for PUT to allow updating only specific fields
    const validationResult = appointmentSchema.partial().safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.format() }, { status: 400 });
    }

    const updateData = validationResult.data;

    // If clientId is being updated, verify the new client still belongs to the therapist.
    if (updateData.clientId && updateData.clientId !== existingAppointment.clientId) {
      const newClient = await prisma.client.findUnique({
        where: { id: updateData.clientId },
      });
      if (!newClient || newClient.therapistId !== therapist.id) {
        return NextResponse.json({ error: 'Invalid new client ID or client does not belong to you.' }, { status: 403 });
      }
    }
    
    // Prevent changing therapistId via this route
    if ((updateData as any).therapistId && (updateData as any).therapistId !== therapist.id) {
        return NextResponse.json({ error: 'Cannot change the therapist ID of an appointment.' }, { status: 400 });
    }


    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
        // therapistId: therapist.id, // Can add as extra DB-level check
      },
      data: {
        ...updateData,
        updatedAt: new Date(), // Explicitly set updatedAt
      },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    return NextResponse.json(updatedAppointment, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating appointment ${context.params.appointmentId}:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error during processing.", details: error.format() }, { status: 400 });
    }
    if (error.code === 'P2025') { // Prisma: Record to update not found
      return NextResponse.json({ error: 'Appointment not found for update.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred while updating the appointment." }, { status: 500 });
  }
}


// --- NEW: DELETE Handler (Delete a specific appointment by ID) ---
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { appointmentId } = context.params;

    if (!appointmentId || typeof appointmentId !== 'string') {
      return NextResponse.json({ error: 'Appointment ID is required and must be a string.' }, { status: 400 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    // Fetch the appointment first to ensure it exists and belongs to this therapist
    const appointmentToDelete = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointmentToDelete) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    // Authorization: Ensure the appointment belongs to the logged-in therapist
    if (appointmentToDelete.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to delete this appointment.' }, { status: 403 });
    }

    // Perform the delete operation
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
        // therapistId: therapist.id, // Can add as extra DB-level check
      },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully.' }, { status: 200 }); // Or status 204 No Content

  } catch (error: any) {
    console.error(`Error deleting appointment ${context.params.appointmentId}:`, error);
    if (error.code === 'P2025') { // Prisma: Record to delete not found.
      return NextResponse.json({ error: 'Appointment not found for deletion.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred while deleting the appointment." }, { status: 500 });
  }
}