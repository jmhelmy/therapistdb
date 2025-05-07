/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Therapist" ADD COLUMN     "billing" TEXT,
ADD COLUMN     "faithOrientation" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "name" TEXT;
