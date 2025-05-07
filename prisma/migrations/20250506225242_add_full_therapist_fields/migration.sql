-- AlterTable
ALTER TABLE "Therapist" ADD COLUMN     "availabilityNote" TEXT,
ADD COLUMN     "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "locationNote" TEXT,
ADD COLUMN     "nearbyCities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "nearbyNeighborhoods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sexuality" TEXT,
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "therapyApproachNote" TEXT,
ADD COLUMN     "therapyTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];
