/*
  Warnings:

  - You are about to drop the column `billing` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `offices` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `professions` on the `Therapist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "billing",
DROP COLUMN "contactInfo",
DROP COLUMN "offices",
DROP COLUMN "professions",
ADD COLUMN     "additionalOffice" TEXT,
ADD COLUMN     "credentials" TEXT,
ADD COLUMN     "fees" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "insurance" TEXT,
ADD COLUMN     "licenseExpiration" TIMESTAMP(3),
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "licenseState" TEXT,
ADD COLUMN     "mentalHealthRole" TEXT,
ADD COLUMN     "npi" TEXT,
ADD COLUMN     "paymentMethods" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "primaryOffice" TEXT,
ADD COLUMN     "profInsurance" TEXT,
ADD COLUMN     "telephone" TEXT,
ADD COLUMN     "title" TEXT;
