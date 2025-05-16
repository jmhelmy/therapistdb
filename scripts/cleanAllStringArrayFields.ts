// scripts/cleanInsuranceData.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function parseComplexInsuranceString(insuranceText: string | null): string[] {
  if (typeof insuranceText !== 'string' || !insuranceText.trim()) {
    return [];
  }

  let cleanedText = insuranceText;
  const preambles = [
    "i am an in-network provider for:",
    "accepts:",
    "in-network with:",
    "takes:",
  ];
  for (const preamble of preambles) {
    if (cleanedText.toLowerCase().startsWith(preamble)) {
      cleanedText = cleanedText.substring(preamble.length).trim();
      break;
    }
  }

  const lines = cleanedText.split('\n');
  const insurances: string[] = [];

  for (let line of lines) {
    line = line.trim();
    line = line.replace(/^[\*\-\•\⁃]\s*/, '').trim(); // Remove list markers

    if (line.length > 0) {
      // Split by comma OR pipe OR " and " (case insensitive).
      // This regex also trims spaces around delimiters.
      const items = line.split(/\s*[,\|]\s*|\s+\band\b\s+/i) 
                        .map(item => item.trim())
                        .filter(item => item.length > 0 && item.toLowerCase() !== 'and'); // Filter out 'and' if it becomes an item
      insurances.push(...items);
    }
  }
  
  const uniqueInsurances = [...new Set(insurances.map(i => i.trim()).filter(i => i && i.length > 0))];
  return uniqueInsurances;
}

interface RawTherapistInsuranceData {
  id: string;
  insuranceAccepted: string | null;
}

async function main() {
  console.log("Starting to clean 'insuranceAccepted' data (raw read, structured write)...");

  const therapistsRawData: RawTherapistInsuranceData[] = 
    await prisma.$queryRaw<RawTherapistInsuranceData[]>`SELECT "id", "insuranceAccepted" FROM "Therapist"`;

  console.log(`Workspaceed ${therapistsRawData.length} records raw.`);
  let updatedCount = 0;
  let recordsProcessed = 0;

  for (const rawRecord of therapistsRawData) {
    recordsProcessed++;
    const currentRawStringValue = rawRecord.insuranceAccepted;
    let needsDatabaseUpdate = false;
    let newInsuranceArray: string[] = [];

    if (typeof currentRawStringValue === 'string') {
      newInsuranceArray = parseComplexInsuranceString(currentRawStringValue);
      console.log(`Therapist ${rawRecord.id}: Converting insurance string (first 100 chars): "${currentRawStringValue.substring(0,100)}..." -> ${JSON.stringify(newInsuranceArray)}`);
      needsDatabaseUpdate = true; // Always attempt update if it was a string to ensure array format
    } else if (currentRawStringValue === null) {
      newInsuranceArray = []; // Default to empty array if null
      console.log(`Therapist ${rawRecord.id}: 'insuranceAccepted' was NULL, ensuring it's stored as [].`);
      needsDatabaseUpdate = true;
    }
    // If it's already an array (which $queryRaw shouldn't return if the DB type is TEXT, but as a safeguard), skip.
    // This script assumes the DB column for insuranceAccepted might contain TEXT that needs conversion.

    if (needsDatabaseUpdate) {
      try {
        await prisma.therapist.update({
          where: { id: rawRecord.id },
          data: {
            insuranceAccepted: newInsuranceArray,
          },
        });
        updatedCount++;
      } catch (e) {
        console.error(`  ERROR updating therapist ${rawRecord.id}. Original: "${currentRawStringValue}". Parsed: ${JSON.stringify(newInsuranceArray)}. Error: `, e);
      }
    }
    if(recordsProcessed % 50 === 0 || recordsProcessed === therapistsRawData.length) {
      console.log(`  Processed ${recordsProcessed}/${therapistsRawData.length}... ${updatedCount} updates made.`);
    }
  }

  console.log(`\nData cleaning for 'insuranceAccepted' finished.`);
  console.log(`Processed ${recordsProcessed} therapist records.`);
  console.log(`${updatedCount} records were targeted for update for the 'insuranceAccepted' field.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("cleanInsuranceData.ts script finished successfully.");
  })
  .catch(async (e) => {
    console.error("An error occurred in the cleanInsuranceData.ts script execution:", e);
    await prisma.$disconnect();
    process.exit(1);
  });