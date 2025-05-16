// src/components/therapistProfile/QualificationsCard.tsx
import Card from '@/components/shared/Card';
import { Fact } from '@/components/shared/Fact';
import { Award, GraduationCap, CalendarDays, Briefcase } from 'lucide-react'; // More specific icons

interface QualificationsCardProps {
  therapist: {
    primaryCredential?: string | null;
    primaryCredentialAlt?: string | null;
    profession?: string | null;
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

  // More robust check if there's any data to display
  const hasAnyData = [primaryCredential, primaryCredentialAlt, profession, licenseStatus, licenseNumber, licenseState, licenseExpirationMonth, licenseExpirationYear, educationSchool, educationDegree, educationYearGraduated, practiceStartYear].some(
    val => val !== null && val !== undefined && String(val).trim() !== ''
  );
  if (!hasAnyData) return null;

  let yearsInPracticeText;
  if (practiceStartYear && practiceStartYear > 1900 && practiceStartYear <= new Date().getFullYear()) {
    const years = new Date().getFullYear() - practiceStartYear;
    yearsInPracticeText = years < 1 ? "Less than a year" : `${years} year${years === 1 ? '' : 's'}`;
  }

  const displayedProfession = profession || [primaryCredential, primaryCredentialAlt].filter(Boolean).join(' / ');
  const licenseInfo = licenseNumber && licenseState ? `${licenseNumber} (${licenseState.toUpperCase()})` : licenseNumber || licenseState?.toUpperCase();
  const licenseExpiration = licenseExpirationMonth && licenseExpirationYear ? `${String(licenseExpirationMonth).padStart(2, '0')}/${licenseExpirationYear}` : undefined;
  const educationInfo = educationDegree && educationSchool ? `${educationDegree} - ${educationSchool}` : educationDegree || educationSchool;

  return (
    <Card title="Credentials & Experience" icon={<Award size={20} className="text-teal-600"/>}>
      <dl className="space-y-2.5 text-base"> {/* Use dl for definition list */}
        {displayedProfession && <Fact label="Profession / Title" value={displayedProfession} icon={<Briefcase size={16} className="text-gray-500 mr-1.5"/>} />}
        {licenseInfo && <Fact label="License" value={licenseInfo} />}
        {licenseStatus && <Fact label="License Status" value={licenseStatus ? licenseStatus.charAt(0).toUpperCase() + licenseStatus.slice(1) : undefined} />}
        {licenseExpiration && <Fact label="License Expires" value={licenseExpiration} />}
        {educationInfo && <Fact label="Education" value={educationInfo} icon={<GraduationCap size={16} className="text-gray-500 mr-1.5"/>} />}
        {educationYearGraduated && <Fact label="Year Graduated" value={educationYearGraduated.toString()} />}
        {practiceStartYear && <Fact label="Practice Since" value={practiceStartYear.toString()} icon={<CalendarDays size={16} className="text-gray-500 mr-1.5"/>} />}
        {yearsInPracticeText && <Fact label="Years in Practice" value={yearsInPracticeText} />}
      </dl>
    </Card>
  );
}