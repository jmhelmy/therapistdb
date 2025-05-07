/*
  Warnings:

  - The `insurance` column on the `Therapist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentMethods` column on the `Therapist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "insurance",
ADD COLUMN     "insurance" TEXT[],
DROP COLUMN "paymentMethods",
ADD COLUMN     "paymentMethods" TEXT[];
