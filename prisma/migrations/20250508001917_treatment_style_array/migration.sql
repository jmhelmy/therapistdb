/*
  Warnings:

  - You are about to drop the column `credentials` on the `Therapist` table. All the data in the column will be lost.
  - The `treatmentStyle` column on the `Therapist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "credentials",
ADD COLUMN     "primaryCredential" TEXT,
ADD COLUMN     "primaryCredentialAlt" TEXT,
DROP COLUMN "treatmentStyle",
ADD COLUMN     "treatmentStyle" TEXT[] DEFAULT ARRAY[]::TEXT[];
