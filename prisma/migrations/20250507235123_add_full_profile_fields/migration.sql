/*
  Warnings:

  - You are about to drop the column `additionalOffice` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityNote` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `billing` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `clientConcerns` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `faithOrientation` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `fees` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `groups` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `insurance` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `licenseExpiration` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `locationNote` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `mentalHealthRole` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `nearbyCities` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `nearbyNeighborhoods` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `npi` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `primaryCredential` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `primaryOffice` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `profInsurance` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `professions` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `profileComplete` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `specialties` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `therapyApproachNote` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `therapyTypes` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `typesOfTherapy` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `yearsInPractice` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "additionalOffice",
DROP COLUMN "availabilityNote",
DROP COLUMN "billing",
DROP COLUMN "city",
DROP COLUMN "clientConcerns",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "education",
DROP COLUMN "expertise",
DROP COLUMN "faithOrientation",
DROP COLUMN "fees",
DROP COLUMN "groups",
DROP COLUMN "insurance",
DROP COLUMN "licenseExpiration",
DROP COLUMN "locationNote",
DROP COLUMN "mentalHealthRole",
DROP COLUMN "nearbyCities",
DROP COLUMN "nearbyNeighborhoods",
DROP COLUMN "npi",
DROP COLUMN "primaryCredential",
DROP COLUMN "primaryOffice",
DROP COLUMN "profInsurance",
DROP COLUMN "professions",
DROP COLUMN "profileComplete",
DROP COLUMN "services",
DROP COLUMN "specialties",
DROP COLUMN "state",
DROP COLUMN "telephone",
DROP COLUMN "therapyApproachNote",
DROP COLUMN "therapyTypes",
DROP COLUMN "title",
DROP COLUMN "typesOfTherapy",
DROP COLUMN "updatedAt",
DROP COLUMN "yearsInPractice",
ADD COLUMN     "additionalAddress" TEXT,
ADD COLUMN     "additionalCity" TEXT,
ADD COLUMN     "additionalState" TEXT,
ADD COLUMN     "additionalZip" TEXT,
ADD COLUMN     "educationDegree" TEXT,
ADD COLUMN     "educationSchool" TEXT,
ADD COLUMN     "educationYearGraduated" INTEGER,
ADD COLUMN     "feeComment" TEXT,
ADD COLUMN     "feeCouples" TEXT,
ADD COLUMN     "feeIndividual" TEXT,
ADD COLUMN     "freeConsultation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inPerson" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "insuranceAccepted" TEXT,
ADD COLUMN     "issues" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "licenseExpirationMonth" INTEGER,
ADD COLUMN     "licenseExpirationYear" INTEGER,
ADD COLUMN     "locationDescription" TEXT,
ADD COLUMN     "mentalHealthRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "nearbyCity1" TEXT,
ADD COLUMN     "nearbyCity2" TEXT,
ADD COLUMN     "nearbyCity3" TEXT,
ADD COLUMN     "participants" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "personalStatement1" TEXT,
ADD COLUMN     "personalStatement2" TEXT,
ADD COLUMN     "personalStatement3" TEXT,
ADD COLUMN     "practiceStartYear" INTEGER,
ADD COLUMN     "primaryAddress" TEXT,
ADD COLUMN     "primaryCity" TEXT,
ADD COLUMN     "primaryState" TEXT,
ADD COLUMN     "primaryZip" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "seoZip1" TEXT,
ADD COLUMN     "seoZip2" TEXT,
ADD COLUMN     "seoZip3" TEXT,
ADD COLUMN     "slidingScale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialtyDescription" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "telehealth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topIssues" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "treatmentStyle" TEXT,
ADD COLUMN     "treatmentStyleDescription" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "workEmail" TEXT,
ALTER COLUMN "ages" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "languages" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "communities" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "paymentMethods" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "name";
