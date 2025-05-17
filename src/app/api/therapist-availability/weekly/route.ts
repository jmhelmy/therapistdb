// src/app/api/therapist-availability/weekly/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { weeklyAvailabilitySchema } from '@/lib/schemas/ehrSchemas'; // Your Zod schema
import { z } from 'zod';

// --- POST Handler (Create a new weekly availability slot) ---
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found.' }, { status: 404 });
    }

    const requestBody = await req.json();
    // The schema expects dayOfWeek, startTime, endTime, and optional effective dates
    const validationResult = weeklyAvailabilitySchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.format() }, { status: 400 });
    }

    const { ...availabilityData } = validationResult.data;

    // Additional Business Logic (Example: Check for overlapping weekly availabilities)
    // This can get complex. The @@unique constraint in Prisma helps, but for more nuanced overlaps:
    const existingSlots = await prisma.weeklyAvailability.findMany({
        where: {
            therapistId: therapist.id,
            dayOfWeek: availabilityData.dayOfWeek,
            // Basic overlap check (can be more sophisticated)
            // This simplistic check doesn't handle all edge cases of time overlaps perfectly.
            // A robust check would involve converting times to minutes from midnight and comparing ranges.
            // OR (
            //     { startTime: { lt: availabilityData.endTime }, endTime: { gt: availabilityData.startTime } }
            // ),
            // Also consider effectiveDate ranges for overlaps
        }
    });

    // A more precise overlap check:
    for (const slot of existingSlots) {
        const newStart = availabilityData.startTime; // "HH:mm"
        const newEnd = availabilityData.endTime;
        const existingStart = slot.startTime;
        const existingEnd = slot.endTime;

        // Check if date ranges overlap (if effective dates are used)
        const datesOverlap = (
            (!availabilityData.effectiveStartDate || !slot.effectiveEndDate || availabilityData.effectiveStartDate < slot.effectiveEndDate) &&
            (!availabilityData.effectiveEndDate || !slot.effectiveStartDate || availabilityData.effectiveEndDate > slot.effectiveStartDate)
        );

        if (datesOverlap) {
            // Check if time ranges overlap
            if (newStart < existingEnd && newEnd > existingStart) {
                 return NextResponse.json({ error: `This availability slot overlaps with an existing one on ${availabilityData.dayOfWeek} between ${existingStart}-${existingEnd}.` }, { status: 409 }); // 409 Conflict
            }
        }
    }


    const newWeeklyAvailability = await prisma.weeklyAvailability.create({
      data: {
        ...availabilityData,
        therapistId: therapist.id,
      },
    });

    return NextResponse.json(newWeeklyAvailability, { status: 201 });

  } catch (error: any) {
    console.error("Error creating weekly availability:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error during processing.", details: error.format() }, { status: 400 });
    }
    if (error.code === 'P2002') { // Prisma unique constraint violation
        return NextResponse.json({ error: 'This exact availability slot (day, times, effective dates) already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}


// --- GET Handler (List all weekly availability slots for the logged-in therapist) ---
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found.' }, { status: 404 });
    }

    const weeklyAvailabilities = await prisma.weeklyAvailability.findMany({
      where: {
        therapistId: therapist.id,
      },
      orderBy: [ // Order by day of week, then by start time
        // Prisma doesn't directly support ordering by enum sequence easily.
        // You might need to fetch and sort in code, or add a numeric field for day order.
        // For now, we can sort by the string representation of DayOfWeek then startTime.
        { dayOfWeek: 'asc' }, // This will sort alphabetically (Friday, Monday, Saturday...)
        { startTime: 'asc' },
      ],
    });
    
    // If you need a specific day order (Sun, Mon, Tue...), you'll need to sort after fetching:
    const dayOrder: Record<string, number> = { SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6 };
    const sortedAvailabilities = weeklyAvailabilities.sort((a, b) => {
        const dayComparison = dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek];
        if (dayComparison !== 0) return dayComparison;
        return a.startTime.localeCompare(b.startTime);
    });


    return NextResponse.json(sortedAvailabilities, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching weekly availabilities:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}