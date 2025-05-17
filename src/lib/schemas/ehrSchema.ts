// src/lib/schemas/ehrSchemas.ts
import { z } from 'zod';

// --- Ensure your existing Zod helpers are available here (either defined or imported) ---
const optionalNullableString = z.string().nullable().optional().or(z.literal(''));
// ... any other helpers you use ...

// --- Existing Schemas (Client, Appointment, ClientNote - keep them here) ---
// export const clientSchema = z.object({ ... });
// export type ClientFormValues = z.infer<typeof clientSchema>;
// ... etc for Appointment and ClientNote ...


// --- NEW: Zod Schemas for Therapist Availability ---

// Schema for DayOfWeek Enum (matches Prisma enum)
export const DayOfWeekEnumSchema = z.enum([
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);
export type DayOfWeek = z.infer<typeof DayOfWeekEnumSchema>;

// Regex for HH:mm time format
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Validates "00:00" to "23:59"

// Schema for WeeklyAvailability
export const weeklyAvailabilitySchema = z.object({
  id: z.string().cuid().optional(), // Optional for creation
  // therapistId is added by the backend

  dayOfWeek: DayOfWeekEnumSchema,
  startTime: z.string().regex(timeRegex, "Invalid start time format. Use HH:mm (e.g., 09:00)."),
  endTime: z.string().regex(timeRegex, "Invalid end time format. Use HH:mm (e.g., 17:00)."),

  effectiveStartDate: z.preprocess((arg) => {
    if (!arg || arg === '') return null;
    if (arg instanceof Date) return arg;
    const date = new Date(String(arg));
    return isNaN(date.getTime()) || String(arg).length < 8 ? null : date;
  }, z.date().nullable().optional()),

  effectiveEndDate: z.preprocess((arg) => {
    if (!arg || arg === '') return null;
    if (arg instanceof Date) return arg;
    const date = new Date(String(arg));
    return isNaN(date.getTime()) || String(arg).length < 8 ? null : date;
  }, z.date().nullable().optional()),
}).refine(data => {
    // Basic check: if both times are present, endTime should be after startTime
    // More complex validation might be needed if times cross midnight for a single entry (usually not the case for availability slots)
    if (data.startTime && data.endTime) {
        const [startH, startM] = data.startTime.split(':').map(Number);
        const [endH, endM] = data.endTime.split(':').map(Number);
        if (endH < startH || (endH === startH && endM <= startM)) {
            return false;
        }
    }
    return true;
}, {
    message: "End time must be after start time for a given day.",
    path: ["endTime"],
}).refine(data => {
    // If effective end date is provided, it must be after or the same as the effective start date
    if (data.effectiveStartDate && data.effectiveEndDate) {
        return data.effectiveEndDate >= data.effectiveStartDate;
    }
    return true;
}, {
    message: "Effective end date must be after or the same as the effective start date.",
    path: ["effectiveEndDate"],
});
export type WeeklyAvailabilityFormValues = z.infer<typeof weeklyAvailabilitySchema>;


// Schema for DateOverride
export const dateOverrideSchema = z.object({
  id: z.string().cuid().optional(), // Optional for creation
  // therapistId is added by the backend

  date: z.preprocess((arg) => {
    if (arg instanceof Date) return arg;
    if (typeof arg === 'string' || typeof arg === 'number') {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date({ required_error: "Date is required for an override." })),

  isAvailable: z.boolean(),
  // startTime and endTime are optional overall, but might be conditionally required
  // based on isAvailable or your business logic (e.g., if isAvailable is true, times are needed)
  startTime: z.string().regex(timeRegex, "Invalid start time format. Use HH:mm.").optional().nullable(),
  endTime: z.string().regex(timeRegex, "Invalid end time format. Use HH:mm.").optional().nullable(),

  reason: optionalNullableString,
}).superRefine((data, ctx) => {
    // If isAvailable is true, startTime and endTime should ideally be provided
    if (data.isAvailable) {
        if (!data.startTime) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Start time is required when setting specific availability.",
                path: ["startTime"],
            });
        }
        if (!data.endTime) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End time is required when setting specific availability.",
                path: ["endTime"],
            });
        }
    }
    // If both startTime and endTime are provided, endTime must be after startTime
    if (data.startTime && data.endTime) {
        const [startH, startM] = data.startTime.split(':').map(Number);
        const [endH, endM] = data.endTime.split(':').map(Number);
        if (endH < startH || (endH === startH && endM <= startM)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End time must be after start time.",
                path: ["endTime"],
            });
        }
    }
    // If only one of startTime or endTime is provided when isAvailable is true (and they are required)
    // The individual checks above handle this.
    // If !isAvailable (block of unavailability), startTime and endTime can define the block, or be null for whole day.
});
export type DateOverrideFormValues = z.infer<typeof dateOverrideSchema>;