// scripts/cleanInsuranceData.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function parseComplexInsuranceString(insuranceText: string | null): string[] {
  if (typeof insuranceText !== 'string' || !insuranceText.trim()) {
    return [];
  }
  // ...(same parsing logic as before)...
  let cleanedText = insuranceText;
  const preambles = [
    "i am an in-network provider for:", "accepts:", "in-network with:", "takes:",
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
    line = line.replace(/^[\*\-\•\⁃]\s*/, '').trim();
    if (line.length > 0) {
      const items = line.split(/\s*[,\|]\s*|\s+\band\b\s+/i)
                        .map(item => item.trim())
                        .filter(item => item.length > 0 && item.toLowerCase() !== 'and');
      insurances.push(...items);
    }
  }
  return [...new Set(insurances.map(i => i.trim()).filter(i => i && i.length > 0))];
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
    let newInsuranceArray: string[];
    let needsDatabaseUpdate = false;

    // --- DETAILED LOGGING ADDED HERE ---
    console.log(`\nProcessing ID: ${rawRecord.id}`);
    console.log(`  Raw 'insuranceAccepted' type: ${typeof currentRawStringValue}`);
    console.log(`  Raw 'insuranceAccepted' value (first 100 chars): "${String(currentRawStringValue).substring(0,100)}"`);

    if (typeof currentRawStringValue === 'string') {
      newInsuranceArray = parseComplexInsuranceString(currentRawStringValue);
      console.log(`  -> Attempting to convert string to array: ${JSON.stringify(newInsuranceArray)}`);
      // We will always mark for update if it was a string, to ensure it's stored in array format
      needsDatabaseUpdate = true;
    } else if (currentRawStringValue === null) {
      newInsuranceArray = [];
      console.log(`  -> Value was NULL, will ensure it's stored as empty array [].`);
      needsDatabaseUpdate = true;
    } else if (Array.isArray(currentRawStringValue)) {
      // This case should ideally not happen if DB column is TEXT and $queryRaw works as expected.
      // But if it does, means $queryRaw already parsed it. We'll just ensure it's clean.
      newInsuranceArray = currentRawStringValue.map(s => String(s).trim()).filter(s => s.length > 0);
      console.log(`  -> Value was already an array (unexpected from TEXT column via $queryRaw): ${JSON.stringify(currentRawStringValue)}. Cleaned to: ${JSON.stringify(newInsuranceArray)}`);
      // Only update if cleaning changed it
      if (JSON.stringify(newInsuranceArray) !== JSON.stringify(currentRawStringValue.filter(s => String(s).trim().length > 0))) {
          needsDatabaseUpdate = true;
      }
    } else {
      console.log(`  -> Value is neither string, null, nor array. Type: ${typeof currentRawStringValue}. Skipping update for this record for safety.`);
      newInsuranceArray = []; // Default to empty array if unhandled type, though update won't run
    }

    if (needsDatabaseUpdate) {
      try {
        await prisma.therapist.update({
          where: { id: rawRecord.id },
          data: {
            insuranceAccepted: newInsuranceArray,
          },
        });
        updatedCount++;
        console.log(`  SUCCESS: Updated therapist ${rawRecord.id}.`);
      } catch (e) {
        console.error(`  ERROR: Failed to update therapist ${rawRecord.id}. Original raw: "${currentRawStringValue}". Parsed: ${JSON.stringify(newInsuranceArray)}. Error: `, e);
      }
    }
    if(recordsProcessed % 200 === 0 || recordsProcessed === therapistsRawData.length) { // Log progress less frequently for large datasets
      console.log(`  Processed ${recordsProcessed}/${therapistsRawData.length}... ${updatedCount} updates made so far.`);
    }
  }

  console.log(`\nData cleaning for 'insuranceAccepted' finished.`);
  console.log(`Processed ${recordsProcessed} therapist records.`);
  console.log(`${updatedCount} records were targeted for update for the 'insuranceAccepted' field.`);
}

main()
  .then(async () => { await prisma.$disconnect(); console.log("cleanInsuranceData.ts script finished successfully."); })
  .catch(async (e) => { console.error("An error occurred in the cleanInsuranceData.ts script execution:", e); await prisma.$disconnect(); process.exit(1); });