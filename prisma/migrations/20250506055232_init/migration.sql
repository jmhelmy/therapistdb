-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Therapist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "city" TEXT,
    "state" TEXT,
    "contactInfo" TEXT,
    "licenseStatus" TEXT,
    "primaryCredential" TEXT,
    "description" TEXT,
    "professions" TEXT,
    "billing" TEXT,
    "offices" TEXT,
    "services" TEXT[],
    "ages" TEXT[],
    "languages" TEXT[],
    "groups" TEXT[],
    "communities" TEXT[],
    "clientConcerns" TEXT[],
    "typesOfTherapy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Therapist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_slug_key" ON "Therapist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_userId_key" ON "Therapist"("userId");

-- AddForeignKey
ALTER TABLE "Therapist" ADD CONSTRAINT "Therapist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
