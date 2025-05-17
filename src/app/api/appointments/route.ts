// src/app/api/appointments/route.ts

import { NextResponse, NextRequest } from 'next/server'; // NextRequest for accessing searchParams
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Your NextAuth options
import { prisma } from '@/lib/prisma';   // Your Prisma client instance
import { appointmentSchema } from '@/lib/schemas/ehrSchemas'; // Your Zod schema for appointments
import { z } from 'zod';

// --- POST Handler (Create a new appointment) ---
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to create an appointment.' }, { status: 401 });
    }

    // Find the therapist ID associated with the current user
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }, // Or however your User is linked to Therapist
      select: { id: true } // We only need the therapist's ID
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const requestBody = await req.json();
    const validationResult = appointmentSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.format() }, { status: 400 });
    }

    const { clientId, ...appointmentData } = validationResult.data;

    // Verify the client exists and belongs to this therapist
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || client.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Client not found or you do not have permission to schedule for this client.' }, { status: 403 }); // Changed to 403 Forbidden
    }

    // Additional business logic (e.g., check for overlapping appointments for the therapist) could go here.
    // For example:
    // const overlappingAppointments = await prisma.appointment.findFirst({
    //   where: {
    //     therapistId: therapist.id,
    //     NOT: { id: undefined }, // Exclude if updating an existing appointment
    //     OR: [
    //       { // New appointment starts during an existing one
    //         startTime: { lt: appointmentData.endTime },
    //         endTime: { gt: appointmentData.startTime },
    //       },
    //     ],
    //   },
    // });
    // if (overlappingAppointments) {
    //   return NextResponse.json({ error: 'This appointment time overlaps with an existing appointment.' }, { status: 409 }); // 409 Conflict
    // }


    const newAppointment = await prisma.appointment.create({
      data: {
        ...appointmentData,
        therapistId: therapist.id,
        clientId: clientId, // Client ID is already validated to belong to the therapist
      },
      include: { // Optionally include client details in the response for immediate use
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    return NextResponse.json(newAppointment, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error("Error creating appointment:", error);
    if (error instanceof z.ZodError) { // Should be caught by safeParse, but good as a fallback
        return NextResponse.json({ error: "Validation error during processing.", details: error.format() }, { status: 400 });
    }
    // Handle other potential Prisma errors or general errors
    return NextResponse.json({ error: error.message || "An unexpected error occurred while creating the appointment." }, { status: 500 });
  }
}


// --- GET Handler (List appointments for the logged-in therapist) ---
export async function GET(req: NextRequest) { // Using NextRequest to easily access searchParams
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to view appointments.' }, { status: 401 });
    }

    // Find the therapist ID associated with the current user
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    // --- Filtering (Example: by date range and/or client ID) ---
    const { searchParams } = req.nextUrl;
    const startDateParam = searchParams.get('startDate'); // Expected format: YYYY-MM-DD
    const endDateParam = searchParams.get('endDate');     // Expected format: YYYY-MM-DD
    const clientIdParam = searchParams.get('clientId');   // Optional: filter by a specific client ID

    const whereConditions: any = { // Prisma.AppointmentWhereInput
      therapistId: therapist.id,
    };

    if (startDateParam) {
      const startDate = new Date(startDateParam + "T00:00:00.000Z"); // Assume start of day in UTC
      if (!isNaN(startDate.getTime())) {
        whereConditions.startTime = { ...whereConditions.startTime, gte: startDate };
      } else {
        return NextResponse.json({ error: 'Invalid startDate format. Use YYYY-MM-DD.' }, { status: 400 });
      }
    }

    if (endDateParam) {
      const endDate = new Date(endDateParam + "T23:59:59.999Z"); // Assume end of day in UTC
      if (!isNaN(endDate.getTime())) {
        // To query for appointments starting on or before the endDate.
        whereConditions.startTime = { ...whereConditions.startTime, lte: endDate };
      } else {
        return NextResponse.json({ error: 'Invalid endDate format. Use YYYY-MM-DD.' }, { status: 400 });
      }
    }
    
    if (startDateParam && endDateParam && new Date(startDateParam) > new Date(endDateParam)) {
        return NextResponse.json({ error: 'startDate cannot be after endDate.' }, { status: 400 });
    }
    
    if (clientIdParam) {
        // You might want to validate if clientIdParam is a valid CUID/UUID format
        // For now, assuming it's a string.
        whereConditions.clientId = clientIdParam;
    }

    // --- Pagination (Consider adding later for performance) ---
    // const page = parseInt(searchParams.get('page') || '1', 10);
    // const limit = parseInt(searchParams.get('limit') || '30', 10); // Default to ~1 month view
    // const skip = (page - 1) * limit;

    const appointments = await prisma.appointment.findMany({
      where: whereConditions,
      // take: limit,
      // skip: skip,
      orderBy: [
        { startTime: 'asc' }, // Default sort by start time
      ],
      include: { // Include related data useful for display
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true, // Optional: if needed in the list
          },
        },
        // therapist: { select: { name: true }} // If needed, though usually filtered by therapist already
      },
    });

    // For pagination, you might also want to return total count for the given filters
    // const totalAppointments = await prisma.appointment.count({ where: whereConditions });
    // return NextResponse.json({ data: appointments, total: totalAppointments, page, limit }, { status: 200 });

    return NextResponse.json(appointments, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred while fetching appointments." }, { status: 500 });
  }
}