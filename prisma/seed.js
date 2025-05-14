"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sync_1 = require("csv-parse/sync");
const slugify_1 = __importDefault(require("slugify"));
const prisma = new client_1.PrismaClient();
async function main() {
    var _a, _b, _c, _d, _e;
    const csvPath = path_1.default.join(process.cwd(), 'data', 'GoodTherapy_CLEANED.csv');
    const file = fs_1.default.readFileSync(csvPath, 'utf-8');
    const rows = (0, sync_1.parse)(file, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    console.log(`📑 Seeding ${rows.length} therapists…`);
    for (const row of rows) {
        const name = row['Name'];
        if (!name)
            continue;
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        await prisma.therapist.upsert({
            where: { slug },
            update: {},
            create: {
                name,
                slug,
                imageUrl: row['Profile Img'] || null,
                published: ((_a = row['Published']) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true',
                profession: row['Profession'] || null,
                tagline: row['Tagline'] || null,
                phone: row['Phone'] || null,
                workEmail: row['Email'] || null,
                website: row['Website'] || null,
                primaryCredential: row['Primary Credential'] || null,
                primaryCredentialAlt: row['Primary Credential Alt'] || null,
                primaryAddress: row['Address'] || null,
                primaryCity: row['City'] || null,
                primaryState: row['State'] || null,
                primaryZip: row['Zip'] || null,
                telehealth: ((_b = row['Teletherapy Available']) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'yes',
                inPerson: ((_c = row['In-Person Available']) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === 'yes',
                locationDescription: row['Location Description'] || null,
                seoZip1: row['Zip'] || null,
                feeIndividual: row['Fee Individual'] || null,
                feeCouples: row['Fee Couples'] || null,
                slidingScale: ((_d = row['Sliding Scale']) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === 'yes',
                freeConsultation: ((_e = row['Free Consultation']) === null || _e === void 0 ? void 0 : _e.toLowerCase()) === 'yes',
                feeComment: row['Fee Comment'] || null,
                paymentMethods: row['Payment Methods']
                    ? row['Payment Methods'].split(',').map((s) => s.trim())
                    : [],
                insuranceAccepted: row['Insurance Accepted'] || null,
                licenseStatus: row['License Status'] || null,
                licenseNumber: row['License Number'] || null,
                licenseState: row['License State'] || null,
                licenseExpirationMonth: row['License Exp Month']
                    ? parseInt(row['License Exp Month'], 10)
                    : null,
                licenseExpirationYear: row['License Exp Year']
                    ? parseInt(row['License Exp Year'], 10)
                    : null,
                educationSchool: row['Education School'] || null,
                educationDegree: row['Education Degree'] || null,
                educationYearGraduated: row['Graduation Year']
                    ? parseInt(row['Graduation Year'], 10)
                    : null,
                practiceStartYear: row['Practice Start Year']
                    ? parseInt(row['Practice Start Year'], 10)
                    : null,
                personalStatement1: row['Personal Statement 1'] || null,
                personalStatement2: row['Personal Statement 2'] || null,
                personalStatement3: row['Personal Statement 3'] || null,
                issues: row['Clients Concerns I treat']
                    ? row['Clients Concerns I treat'].split(',').map((s) => s.trim())
                    : [],
                ages: row['Age Range']
                    ? row['Age Range'].split(',').map((s) => s.trim())
                    : [],
                languages: row['Languages']
                    ? row['Languages'].split(',').map((s) => s.trim())
                    : [],
                participants: row['Groups I work with']
                    ? row['Groups I work with'].split(',').map((s) => s.trim())
                    : [],
                communities: row['Communities Served']
                    ? row['Communities Served'].split(',').map((s) => s.trim())
                    : [],
                treatmentStyle: row['Types of Therapy']
                    ? row['Types of Therapy'].split(',').map((s) => s.trim())
                    : [],
                specialtyDescription: row['Specialty Description'] || null,
                treatmentStyleDescription: row['Therapy Style Description'] || null,
            },
        });
        console.log(`✔️ Upserted ${name}`);
    }
    console.log('✅ Seed complete!');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
