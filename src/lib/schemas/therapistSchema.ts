import { z } from 'zod'

// 1. Basics Form
export const basicsSchema = z.object({
  name: z.string().optional(),
  primaryCredential: z.string().optional(),
  primaryCredentialAlt: z.string().optional(),
  phone: z.string().optional(),
  workEmail: z.string().optional(),
  website: z.string().url("Invalid URL").optional(),
  imageUrl: z.string().url().optional(),
})
export type BasicsFormValues = z.infer<typeof basicsSchema>

// 2. Location Form
export const locationSchema = z.object({
  primaryAddress: z.string().optional(),
  primaryCity: z.string().optional(),
  primaryState: z.string().optional(),
  primaryZip: z.string().optional(),
  additionalAddress: z.string().optional(),
  additionalCity: z.string().optional(),
  additionalState: z.string().optional(),
  additionalZip: z.string().optional(),
  telehealth: z.boolean().optional(),
  inPerson: z.boolean().optional(),
  locationDescription: z.string().optional(),
})
export type LocationFormValues = z.infer<typeof locationSchema>

// 3. Finances Form
export const financesSchema = z.object({
  feeIndividual: z.string().optional(),
  feeCouples: z.string().optional(),
  slidingScale: z.boolean().optional(),
  freeConsultation: z.boolean().optional(),
  feeComment: z.string().optional(),
  paymentMethods: z.array(z.string()).optional(),
  insuranceAccepted: z.string().optional(),
})
export type FinancesFormValues = z.infer<typeof financesSchema>

// 4. Personal Statement Form
export const personalStatementSchema = z.object({
  tagline: z.string().optional(),
  personalStatement1: z.string().optional(),
  personalStatement2: z.string().optional(),
  personalStatement3: z.string().optional(),
})
export type PersonalStatementFormValues = z.infer<typeof personalStatementSchema>

// 5. Qualifications Form
export const qualificationsSchema = z.object({
  licenseStatus: z.enum(['licensed', 'pre-licensed', 'none']).optional(),
  primaryCredential: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseState: z.string().optional(),
  licenseExpirationMonth: z.number().nullable().optional(),
  licenseExpirationYear: z.number().nullable().optional(),
  schoolName: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.number().nullable().optional(),
  yearsInPractice: z.number().nullable().optional(),
})
export type QualificationsFormValues = z.infer<typeof qualificationsSchema>

// 6. Specialties Form
export const specialtiesSchema = z.object({
  clientConcerns: z.array(z.string()).optional(),
  topConcerns: z.array(z.string()).optional(),
  specialtyDescription: z.string().optional(),
  mentalHealth: z.array(z.string()).optional(),
  sexuality: z.array(z.string()).optional(),
  ages: z.array(z.string()).optional(),
  participants: z.array(z.string()).optional(),
  communities: z.array(z.string()).optional(),
  faith: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
})
export type SpecialtiesFormValues = z.infer<typeof specialtiesSchema>

// 7. Treatment Style Form
export const treatmentStyleSchema = z.object({
  treatmentStyle: z.array(z.string()).optional(),
  treatmentStyleDescription: z.string().optional(),
})
export type TreatmentStyleFormValues = z.infer<typeof treatmentStyleSchema>

// 8. Full Profile (merged for publishing or saving draft)
export const fullTherapistSchema = z
  .object({})
  .merge(basicsSchema)
  .merge(locationSchema)
  .merge(financesSchema)
  .merge(personalStatementSchema)
  .merge(qualificationsSchema)
  .merge(specialtiesSchema)
  .merge(treatmentStyleSchema)
  .default({})

export const defaultFormData = fullTherapistSchema._def.defaultValue()

export type FullTherapistProfile = z.infer<typeof fullTherapistSchema>
