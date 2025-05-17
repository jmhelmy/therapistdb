import { z } from 'zod';

// Helper for optional numeric strings that should be numbers or null
const optionalNumericStringOrEmpty = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? val : num; // Pass as is if NaN, Zod .number() will catch
  },
  z.number().nullable().optional()
);

export const GENDER_OPTIONS = ["male", "female", "other", "prefer_not_to_say"] as const;

// Common modifier for optional strings that can also be empty strings OR NULL
const optionalNullableString = z.string().nullable().optional().or(z.literal(''));

// Specific for URLs that can also be null or empty
const optionalNullableUrlString = z.string().url("Invalid URL format. Must include http(s):// if provided.").nullable().optional().or(z.literal(''));

// Modifier for optional strings that CANNOT be null, but can be "" or undefined
const optionalStringCannotBeNull = z.string().optional().or(z.literal(''));


// 1. Basics Form
export const basicsSchema = z.object({
  name: optionalStringCannotBeNull, // Cannot be null, but can be "" or undefined
  primaryCredential: optionalNullableString,
  primaryCredentialAlt: optionalNullableString,
  gender: z.enum(GENDER_OPTIONS).nullable().optional(),
  phone: optionalNullableString, // Consider adding .regex() for phone format if desired
  workEmail: z.string().email("Invalid email format if provided.").nullable().optional().or(z.literal('')),
  website: optionalNullableUrlString,
  imageUrl: optionalNullableUrlString,
  coverImageUrl: optionalNullableUrlString,
});
export type BasicsFormValues = z.infer<typeof basicsSchema>;

// 2. Location Form
export const locationSchema = z.object({
  primaryAddress: optionalNullableString,
  primaryCity: optionalNullableString,
  primaryState: optionalNullableString,
  primaryZip: optionalNullableString, // Consider .regex() for ZIP format
  additionalAddress: optionalNullableString,
  additionalCity: optionalNullableString,
  additionalState: optionalNullableString,
  additionalZip: optionalNullableString,
  telehealth: z.boolean().nullable().optional(),
  inPerson: z.boolean().nullable().optional(),
  locationDescription: optionalNullableString,
});
export type LocationFormValues = z.infer<typeof locationSchema>;

// 3. Finances Form
export const financesSchema = z.object({
  feeIndividual: optionalNullableString, // Handles values like "$150", "120-180", "Contact"
  feeCouples: optionalNullableString,
  slidingScale: z.boolean().nullable().optional(),
  freeConsultation: z.boolean().nullable().optional(),
  feeComment: optionalNullableString,
  paymentMethods: z.array(z.string()).optional().default([]),
  insuranceAccepted: optionalNullableString, // Stores the name of the insurance plan as a string
});
export type FinancesFormValues = z.infer<typeof financesSchema>;

// 4. Personal Statement Form
export const personalStatementSchema = z.object({
  tagline: optionalNullableString,
  personalStatement1: optionalNullableString,
  personalStatement2: optionalNullableString,
  personalStatement3: optionalNullableString,
});
export type PersonalStatementFormValues = z.infer<typeof personalStatementSchema>;

// 5. Qualifications Form
export const qualificationsSchema = z.object({
  licenseStatus: z.enum(['licensed', 'pre-licensed', 'none']).nullable().optional(),
  profession: optionalNullableString, // Role, e.g., "Psychotherapist", "Counselor"
  licenseNumber: optionalNullableString,
  licenseState: optionalNullableString, // e.g., "CA", "NY"
  licenseExpirationMonth: optionalNumericStringOrEmpty,
  licenseExpirationYear: optionalNumericStringOrEmpty,
  educationSchool: optionalNullableString,
  educationDegree: optionalNullableString,
  educationYearGraduated: optionalNumericStringOrEmpty,
  practiceStartYear: optionalNumericStringOrEmpty,
});
export type QualificationsFormValues = z.infer<typeof qualificationsSchema>;

// 6. Specialties Form
export const specialtiesSchema = z.object({
  issues: z.array(z.string()).optional().default([]), // Main list of issues therapist treats
  topIssues: z.array(z.string()).max(3, "Select up to 3 top issues.").optional().default([]), // User-selected top 3
  specialtyDescription: optionalNullableString,
  mentalHealthInterests: z.array(z.string()).optional().default([]),
  sexualityInterests: z.array(z.string()).optional().default([]),
  ages: z.array(z.string()).optional().default([]),
  participants: z.array(z.string()).optional().default([]),
  communities: z.array(z.string()).optional().default([]),
  faithInterests: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
});
export type SpecialtiesFormValues = z.infer<typeof specialtiesSchema>;

// 7. Treatment Style Form
export const treatmentStyleSchema = z.object({
  treatmentStyle: z.array(z.string()).optional().default([]),
  treatmentStyleDescription: optionalNullableString,
});
export type TreatmentStyleFormValues = z.infer<typeof treatmentStyleSchema>;

// --- NEW: 8. Client Magnet AI Profile Schema ---
// This schema defines the structure for the data related to the Client Magnet AI feature.
// These fields correspond to what we planned to store in the ClientMagnetProfile Prisma model.
export const clientMagnetProfileSchema = z.object({
  // Stores the main AI-generated marketing copy.
  // This is the text the therapist will review, edit, and potentially use in their profile.
  aiGeneratedMarketingCopy: optionalNullableString,

  // Stores the therapist's answer to the intake question: "Tell me about a client you liked working with"
  clientStoryExample: optionalNullableString,

  // Stores the therapist's notes or ideas related to the intake question: "Do you have a good video to upload?"
  videoUploadIdeas: optionalNullableString,

  // You could add an optional field here if you decide to store the AI-suggested tagline separately
  // within the clientMagnetProfile object, e.g.:
  // aiSuggestedTagline: optionalNullableString,
});
export type ClientMagnetProfileFormValues = z.infer<typeof clientMagnetProfileSchema>;


// --- Full Merged Therapist Profile Schema ---
export const fullTherapistSchema = basicsSchema
  .merge(locationSchema)
  .merge(financesSchema)
  .merge(personalStatementSchema)
  .merge(qualificationsSchema)
  .merge(specialtiesSchema)
  .merge(treatmentStyleSchema)
  .extend({
    id: z.string().cuid().optional(), // CUID if it's a new record, string if existing
    slug: z.string().nullable().optional().or(z.literal('')),
    published: z.boolean().default(false).optional(),
    // userId: z.string().cuid() // Example: if you link therapist profiles to a User model

    // --- NEW: Add the Client Magnet AI profile data as an optional and nullable object ---
    clientMagnetProfile: clientMagnetProfileSchema.optional().nullable(),
  });

export type FullTherapistProfile = z.infer<typeof fullTherapistSchema>;

// Default form data for initializing react-hook-form
export const defaultFormData: FullTherapistProfile = {
  // Top-level
  id: undefined,
  slug: '',
  published: false,

  // Basics
  name: '',
  primaryCredential: null,
  primaryCredentialAlt: null,
  gender: null,
  phone: null,
  workEmail: null,
  website: null,
  imageUrl: null,
  coverImageUrl: null,

  // Location
  primaryAddress: null,
  primaryCity: null,
  primaryState: null,
  primaryZip: null,
  additionalAddress: null,
  additionalCity: null,
  additionalState: null,
  additionalZip: null,
  telehealth: null,
  inPerson: null,
  locationDescription: null,

  // Finances
  feeIndividual: '',
  feeCouples: '',
  slidingScale: null,
  freeConsultation: null,
  feeComment: '',
  paymentMethods: [],
  insuranceAccepted: '',

  // Personal Statement
  tagline: null,
  personalStatement1: null,
  personalStatement2: null,
  personalStatement3: null,

  // Qualifications
  licenseStatus: null,
  profession: null,
  licenseNumber: null,
  licenseState: null,
  licenseExpirationMonth: null,
  licenseExpirationYear: null,
  educationSchool: null,
  educationDegree: null,
  educationYearGraduated: null,
  practiceStartYear: null,

  // Specialties
  issues: [],
  topIssues: [],
  specialtyDescription: null,
  mentalHealthInterests: [],
  sexualityInterests: [],
  ages: [],
  participants: [],
  communities: [],
  faithInterests: [],
  languages: [],

  // Treatment Style
  treatmentStyle: [],
  treatmentStyleDescription: null,

  // --- NEW: Default values for Client Magnet AI Profile data ---
  // Initialize as null because the entire ClientMagnetProfile record is optional for a therapist.
  // If a therapist interacts with the feature, this object will be populated.
  clientMagnetProfile: null,
  // If you prefer to always have the object structure present, even with null fields:
  // clientMagnetProfile: {
  //   aiGeneratedMarketingCopy: null,
  //   clientStoryExample: null,
  //   videoUploadIdeas: null,
  // },
};