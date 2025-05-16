// scripts/checkColumnTypes.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function runQuery() {
  console.log("Attempting to fetch column type information from the database...");
  try {
    // The SQL query to check column types
    // Make sure table_name 'Therapist' and all column_names in the IN clause are correct
    // and match your database (PostgreSQL is case-sensitive for quoted identifiers).
    const result = await prisma.$queryRaw<any[]>(
      Prisma.sql`
        SELECT
            column_name,
            data_type,
            udt_name,
            is_nullable,
            column_default
        FROM
            information_schema.columns
        WHERE
            table_schema = 'public' -- Adjust 'public' if your schema name is different
            AND table_name   = 'Therapist'
            AND column_name  IN (
                'paymentMethods',
                'insuranceAccepted',
                'issues',
                'topIssues',
                'mentalHealthInterests',
                'sexualityInterests',
                'ages',
                'participants',
                'communities',
                'faithInterests',
                'languages',
                'treatmentStyle'
                -- Add any other String[] fields from your Prisma schema if you have more
            );
      `
    );

    console.log("\n--- Column Type Check Results ---");
    if (result && result.length > 0) {
      console.table(result);
      console.log("\nWhat to look for:");
      console.log("For each 'column_name' that is a String[] in your Prisma schema:");
      console.log("  - 'data_type' should ideally be 'ARRAY'");
      console.log("  - 'udt_name' should ideally be '_text' (which means text[])");
      console.log("If it's different (e.g., 'text' or 'character varying'), that's the problem area.");
    } else {
      console.log("No results returned. Check table name, schema name, and column names in the query.");
    }

  } catch (error) {
    console.error("\nERROR running SQL query to check column types:", error);
  } finally {
    await prisma.$disconnect();
    console.log("\nDisconnected from database.");
  }
}

runQuery();