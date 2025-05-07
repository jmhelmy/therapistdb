import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function importCSV() {
  const filePath = path.join(__dirname, '../data/therapists.csv');

  const therapists: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      therapists.push({
        name: row.name,
        slug: row.slug,
        city: row.city,
        state: row.state,
        languages: row.languages?.split(',').map(s => s.trim()),
        clientConcerns: row.clientConcerns?.split(',').map(s => s.trim()),
        typesOfTherapy: row.typesOfTherapy?.split(',').map(s => s.trim()),
        // Add more fields here as needed
      });
    })
    .on('end', async () => {
      for (const data of therapists) {
        await prisma.therapist.create({ data });
      }
      console.log(`Imported ${therapists.length} therapists.`);
      await prisma.$disconnect();
    });
}

importCSV().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
