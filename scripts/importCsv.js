const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const prisma = new PrismaClient();

// -----------------------
// Helper Functions
// -----------------------
function parseList(str) {
  return typeof str === 'string'
    ? str.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
}

function parseAvailability(text) {
  if (!text) return null;
  return text.toLowerCase().includes('online') || text.toLowerCase().includes('tele');
}

function parseInPerson(text) {
  if (!text) return null;
  return text.toLowerCase().includes('in-person') || text.toLowerCase().includes('both');
}

function extractZip(address) {
  if (!address) return null;
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

function generateSlug(name) {
  if (!name) return null;
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseLicenseNumber(cert) {
  if (!cert) return null;
  const match = cert.match(/\/\s*(\w+)?\s*(\d+)/);
  return match ? match[2] : null;
}

function parseLicenseState(cert) {
  if (!cert) return null;
  const match = cert.match(/Licensed by State of (\w+)/);
  return match ? match[1] : null;
}

function parseEducationSchool(text) {
  if (!text) return null;
  const match = text.match(/Attended (.+?),/);
  return match ? match[1].trim() : null;
}

function parseGraduationYear(text) {
  if (!text) return null;
  const match = text.match(/Graduated\s*(\d{4})/);
  return match ? parseInt(match[1]) : null;
}

function parsePracticeStartYear(text) {
  if (!text) return null;
  const match = text.match(/In Practice for\s*(\d{1,2})/);
  const years = match ? parseInt(match[1]) : null;
  return years ? new Date().getFullYear() - years : null;
}

// -----------------------
// Main Import Function
// -----------------------
async function importTherapists() {
  const filePath = path.join(process.env.HOME, 'Downloads', 'psychologytoday_data', 'psychologytoday_data.csv');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found at: ${filePath}`);
    process.exit(1);
  }

  const parser = fs.createReadStream(filePath).pipe(
    parse({ columns: true, skip_empty_lines: true })
  );

  let count = 0;

  for await (const record of parser) {
    try {
      console.log(`➡️ Importing: ${record.Name}`);

      await prisma.therapist.create({
        data: {
          name: record.Name || null,
          slug: generateSlug(record.Name),
          published: true,

          // Credentials
          primaryCredential: record.Profession || null,
          primaryCredentialAlt: null,
          gender: null,

          // Contact + Image
          phone: record.Telephone || null,
          workEmail: null,
          website: record.Website || null,
          imageUrl: record.Image_URL || null,
          coverImageUrl: null,

          // Location
          primaryAddress: record['Primary Office'] || null,
          primaryCity: record.City || null,
          primaryState: record.State || null,
          primaryZip: extractZip(record['Primary Office']),
          additionalAddress: record['Additional Office'] || null,
          additionalCity: null,
          additionalState: null,
          additionalZip: null,
          telehealth: parseAvailability(record.Availibility),
          inPerson: parseInPerson(record.Availibility),
          locationDescription: record.Location_Open || null,

          // SEO / Nearby
          seoZip1: parseList(record.Zips_nearby)[0] || null,
          seoZip2: parseList(record.Zips_nearby)[1] || null,
          seoZip3: parseList(record.Zips_nearby)[2] || null,
          nearbyCity1: parseList(record.Cities_nearby)[0] || null,
          nearbyCity2: parseList(record.Cities_nearby)[1] || null,
          nearbyCity3: parseList(record.Cities_nearby)[2] || null,

          // Fees
          feeIndividual: record.Fees_individual || null,
          feeCouples: record.Fees_couple || null,
          slidingScale: record.Sliding_Scale?.toLowerCase().includes('yes') || null,
          freeConsultation: null,
          feeComment: record.Finances_Open || null,
          paymentMethods: parseList(record.Payment_method),
          insuranceAccepted: record.Insurance || null,

          // License + Education
          licenseNumber: parseLicenseNumber(record.Certification),
          licenseState: parseLicenseState(record.Certification),
          licenseStatus: null,
          licenseExpirationMonth: null,
          licenseExpirationYear: null,
          educationSchool: parseEducationSchool(record.Education_and_Years_In_Practice),
          educationDegree: null,
          educationYearGraduated: parseGraduationYear(record.Education_and_Years_In_Practice),
          practiceStartYear: parsePracticeStartYear(record.Education_and_Years_In_Practice),

          // Personal Statements
          tagline: null,
          personalStatement1: record.Description || null,
          personalStatement2: record.Treatment_Approach_Open || null,
          personalStatement3: record['Practice at Glance_Open'] || null,

          // Issues / Specialties
          issues: parseList(record.Expertise),
          topIssues: parseList(record['Top Specialties']),
          specialtyDescription: record.Expertise_Open || null,
          mentalHealthInterests: [],
          sexualityInterests: [],
          ages: parseList(record.Age),
          participants: parseList(record.Participants),
          communities: parseList(record.Communities),
          faithInterests: parseList(record.Religion),
          languages: parseList(record.Languages),

          // Treatment
          treatmentStyle: parseList(record.Types_of_Therapy),
          treatmentStyleDescription: null,
        }
      });

      count++;
    } catch (e) {
      console.error(`❌ Failed to import ${record.Name}: ${e.message}`);
    }
  }

  console.log(`✅ Imported ${count} therapist profiles.`);
  await prisma.$disconnect();
}

// -----------------------
importTherapists().catch((e) => {
  console.error('❌ Script crashed:', e);
  process.exit(1);
});
