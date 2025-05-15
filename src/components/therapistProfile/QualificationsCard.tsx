// src/components/therapistProfile/QualificationsCard.tsx
import Card from '@/components/shared/Card';
import { Fact } from '@/components/shared/Fact'; // Ensure Fact handles undefined values gracefully
import { Award } from 'lucide-react';

interface QualificationsCardProps {
  therapist: {
    primaryCredential?: string | null; // From Basics
    primaryCredentialAlt?: string | null; // From Basics
    profession?: string | null; // From Qualifications schema
    licenseStatus?: string | null;
    licenseNumber?: string | null;
    licenseState?: string | null;
    licenseExpirationMonth?: number | null;
    licenseExpirationYear?: number | null;
    educationSchool?: string | null;
    educationDegree?: string | null;
    educationYearGraduated?: number | null;
    practiceStartYear?: number | null;
  };
}

export default function QualificationsCard({ therapist }: QualificationsCardProps) {
  const {
    primaryCredential, primaryCredentialAlt, profession,
    licenseStatus, licenseNumber, licenseState, licenseExpirationMonth, licenseExpirationYear,
    educationSchool, educationDegree, educationYearGraduated, practiceStartYear,
  } = therapist;

  const hasAnyData = Object.values(therapist).some(value => value !== null && value !== undefined && (Array.isArray(value) ? value.length > 0 : String(value).trim() !== ''));
  if (!hasAnyData) return null;


  let yearsInPracticeText;
  if (practiceStartYear) {
    const currentYear = new Date().getFullYear();
    if (practiceStartYear <= currentYear) {
      const years = currentYear - practiceStartYear;
      yearsInPracticeText = years < 1 ? "Less than a year" : `${years} year${years === 1 ? '' : 's'}`;
    }
  }

  // Combine primary credentials from basics and profession from qualifications if distinct
  const displayedProfession = profession || [primaryCredential, primaryCredentialAlt].filter(Boolean).join(', ');

  return (
    <Card title="Professional Qualifications" icon={<Award className="w-5 h-5 mr-2"/>}>
      <dl className="space-y-3 text-sm"> {/* Increased spacing slightly */}
        <Fact label="Primary Role/Credentials" value={displayedProfession} />
        <Fact label="License Status" value={licenseStatus ? licenseStatus.charAt(0).toUpperCase() + licenseStatus.slice(1) : undefined} />
        <Fact label="License Number" value={licenseNumber && licenseState ? `${licenseNumber} (${licenseState})` : licenseNumber} />
        {/* <Fact label="License State" value={licenseState} /> // Combined with number if both exist */}
        <Fact
          label="License Expiration"
          value={
            licenseExpirationMonth && licenseExpirationYear
              ? `${String(licenseExpirationMonth).padStart(2, '0')}/${licenseExpirationYear}`
              : undefined
          }
        />
        <Fact label="Education" value={educationDegree && educationSchool ? `${educationDegree}, ${educationSchool}` : educationDegree || educationSchool} />
        <Fact label="Year Graduated" value={educationYearGraduated?.toString()} />
        <Fact label="Practice Started" value={practiceStartYear?.toString()} />
        {yearsInPracticeText && <Fact label="Years of Experience (approx.)" value={yearsInPracticeText} />}
      </dl>
    </Card>
  );
}