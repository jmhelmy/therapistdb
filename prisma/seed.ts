import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const therapists = [
  {
    name: "Dr. Emily Rivera",
    slug: "emily-rivera",
    published: true,
    imageUrl: "/default-avatar.png",
    city: "Los Angeles",
    state: "CA",
    licenseStatus: "Active",
    licenseNumber: "83453",
    licenseState: "CA",
    licenseExpiration: new Date("2028-12-31"),
    primaryCredential: "LMHC",
    description: "Supporting individuals with relationship issues.",
    billing: "Private Pay",
    fees: "150",
    paymentMethods: ["Check", "Cash"],
    insurance: ["Cigna", "United Healthcare"],
    languages: ["English", "Korean"],
    clientConcerns: ["Self-Esteem", "Depression"],
    typesOfTherapy: ["CBT", "Narrative"],
    services: ["Individual", "Family"],
    ages: ["Children", "Teens"],
    groups: ["Men", "LGBTQ+"],
    communities: ["Tech Professionals", "Faith-Based"],
    profileComplete: false,
    professions: "Therapist",
    specialties: ["Relationships", "Trauma"],
    expertise: ["Mindfulness", "Couples Therapy"],
    sexuality: "Straight",
    gender: "Female",
    faithOrientation: "Christian",
    availabilityNote: "Available weekdays and some evenings.",
    therapyApproachNote: "Uses an integrative approach combining multiple modalities.",
    nearbyCities: ["Cambridge", "Oakland"],
    nearbyNeighborhoods: ["Downtown", "Harbor District"],
    locationNote: "Office is easily accessible by public transport.",
    primaryOffice: "533 Wellness Ave.",
    additionalOffice: null,
    telephone: null,
    education: "MA in Clinical Psychology",
    yearsInPractice: "5",
    npi: "4780023181",
    profInsurance: "Yes",
    userId: null
  }
]

async function main() {
  for (const therapist of therapists) {
    await prisma.therapist.create({ data: therapist })
  }
  console.log('✅ Seed complete')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
