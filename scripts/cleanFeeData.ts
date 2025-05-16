// scripts/cleanFeeData.ts
import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma for raw query types

const prisma = new PrismaClient();

const feeRegex = /(?:\$?\s*)(\d[\d,]*\.?\d*)/;

async function extractNumericFee(feeString: string | null): Promise<number | null> {
  if (!feeString || typeof feeString !== 'string' || feeString.trim() === "") { // Handle empty string explicitly
    if (feeString !== null && feeString.trim() === "") {
        console.log(`  -> Empty string found, setting to NULL.`);
    }
    return null;
  }

  const lowerFeeString = feeString.toLowerCase();
  if (
    lowerFeeString.includes('contact for fee') ||
    lowerFeeString.includes('free consultation') ||
    lowerFeeString.includes('n/a') ||
    lowerFeeString.includes('inquire for rates') ||
    lowerFeeString.includes('see website')
  ) {
    console.log(`  -> Non-numeric phrase found in "${feeString}", setting to NULL.`);
    return null;
  }

  if (lowerFeeString.includes('sliding scale')) {
    const slideMatch = lowerFeeString.match(feeRegex);
    if (slideMatch && slideMatch[1]) {
      try {
        const numericString = slideMatch[1].replace(/,/g, '');
        const fee = parseFloat(numericString);
        if (!isNaN(fee)) {
          console.log(`  -> Sliding scale text "${feeString}", extracted ${Math.round(fee)}.`);
          return Math.round(fee);
        }
      } catch (error) {
        // Fall through
      }
    }
    console.log(`  -> Sliding scale text found in "${feeString}", but no clear number, setting to NULL.`);
    return null;
  }

  const match = feeString.match(feeRegex);
  if (match && match[1]) {
    try {
      const numericString = match[1].replace(/,/g, '');
      const fee = parseFloat(numericString);
      if (!isNaN(fee)) {
        return Math.round(fee);
      }
    } catch (error) {
      console.warn(`  -> WARN: Could not parse fee from matched part: "${match[1]}" (original: "${feeString}")`);
      return null;
    }
  }
  console.warn(`  -> WARN: No clear numeric fee found in: "${feeString}", setting to NULL.`);
  return null;
}

// Define the expected shape of the raw query result
interface RawTherapistFeeData {
  id: string;
  feeIndividual: string | null; // Expect to read strings or null
  feeCouples: string | null;    // Expect to read strings or null
}

async function main() {
  console.log("Starting to clean 'feeIndividual' and 'feeCouples' data using raw query for reads...");

  // Step 1: Fetch IDs and fee fields as raw text using $queryRaw
  // Ensure table "Therapist" and columns "feeIndividual", "feeCouples" match your DB (case-sensitive for PostgreSQL)
  const therapistsRawData: RawTherapistFeeData[] = 
    await prisma.$queryRaw<RawTherapistFeeData[]>`SELECT "id", "feeIndividual", "feeCouples" FROM "Therapist"`;

  console.log(`Fetched ${therapistsRawData.length} therapist records raw.`);
  let updatedCount = 0;
  let recordsProcessed = 0;

  for (const rawRecord of therapistsRawData) {
    recordsProcessed++;
    const dataToUpdate: { feeIndividual?: number | null; feeCouples?: number | null } = {};
    let needsDatabaseUpdate = false;

    // Process feeIndividual
    const currentFeeIndividualString = rawRecord.feeIndividual;
    const newFeeIndividual = await extractNumericFee(currentFeeIndividualString);
    // Determine if an update is needed for feeIndividual:
    // - If the original was a string (even if it parses to the same number or null, we want to ensure the type is changed in DB)
    // - Or if the original was a number but parsing results in a different number (less likely here as we read strings)
    // - Or if the original was null and the new value is a number (less likely if extractNumericFee returns null for null)
    // For simplicity with raw string reads: if the parsed value is different from what a direct numeric cast of current string would be,
    // or if the current string is not null and the new value is null (e.g. "abc" -> null), or if current string is null and new is null (to ensure type)
    // A simpler rule: always set it, as we're converting from (potentially) string to number/null.
    if (newFeeIndividual !== undefined) { // extractNumericFee returns null or number
        dataToUpdate.feeIndividual = newFeeIndividual;
        needsDatabaseUpdate = true; // Assume update is needed to ensure correct type and value
        if (currentFeeIndividualString !== null) {
             console.log(`Therapist ${rawRecord.id}: Processing feeIndividual string: "${currentFeeIndividualString}" -> ${newFeeIndividual}`);
        } else {
             console.log(`Therapist ${rawRecord.id}: Processing feeIndividual NULL -> ${newFeeIndividual}`);
        }
    }


    // Process feeCouples
    const currentFeeCouplesString = rawRecord.feeCouples;
    const newFeeCouples = await extractNumericFee(currentFeeCouplesString);
    if (newFeeCouples !== undefined) {
        dataToUpdate.feeCouples = newFeeCouples;
        needsDatabaseUpdate = true; // Assume update is needed
        if (currentFeeCouplesString !== null) {
            console.log(`Therapist ${rawRecord.id}: Processing feeCouples string: "${currentFeeCouplesString}" -> ${newFeeCouples}`);
        } else {
            console.log(`Therapist ${rawRecord.id}: Processing feeCouples NULL -> ${newFeeCouples}`);
        }
    }

    if (needsDatabaseUpdate) {
      try {
        // Step 2: Update the record using the typed Prisma client
        await prisma.therapist.update({
          where: { id: rawRecord.id },
          data: dataToUpdate,
        });
        updatedCount++;
        if (recordsProcessed % 20 === 0) {
          console.log(`  Processed ${recordsProcessed}/${therapistsRawData.length}... ${updatedCount} updates so far.`);
        }
      } catch (e) {
        console.error(`  ERROR: Failed to update therapist ${rawRecord.id}. Raw Individual: "${currentFeeIndividualString}", Raw Couples: "${currentFeeCouplesString}". Parsed: ${JSON.stringify(dataToUpdate)}. Error:`, e);
      }
    }
  }

  console.log(`\nFee data cleaning finished.`);
  console.log(`Processed ${recordsProcessed} therapist records.`);
  console.log(`${updatedCount} records were targeted for update.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Script finished successfully.");
  })
  .catch(async (e) => {
    console.error("An error occurred in the cleanFeeData.ts script execution:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
