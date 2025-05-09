// src/components/therapistProfile/QualificationsCard.tsx
import Card from '@/components/shared/Card'
import { Fact } from '@/components/shared/Fact'

export default function QualificationsCard({ therapist }: { therapist: any }) {
  const {
    primaryCredential,
    primaryCredentialAlt,
    licenseStatus,
    licenseNumber,
    licenseState,
    licenseExpirationMonth,
    licenseExpirationYear,
    educationSchool,
    educationDegree,
    educationYearGraduated,
    practiceStartYear,
  } = therapist

  // If absolutely nothing here, skip the whole card
  const hasAny =
    primaryCredential ||
    primaryCredentialAlt ||
    licenseStatus ||
    licenseNumber ||
    licenseState ||
    (licenseExpirationMonth && licenseExpirationYear) ||
    educationSchool ||
    educationDegree ||
    educationYearGraduated ||
    practiceStartYear

  if (!hasAny) return null

  return (
    <Card title="Qualifications">
      <dl className="space-y-2">
        <Fact
          label="Profession"
          value={[primaryCredential, primaryCredentialAlt].filter(Boolean).join(', ')}
        />
        <Fact label="License Status" value={licenseStatus} />
        <Fact
          label="License #"
          value={licenseNumber}
        />
        <Fact
          label="License State"
          value={licenseState}
        />
        <Fact
          label="License Exp."
          value={
            licenseExpirationMonth && licenseExpirationYear
              ? `${licenseExpirationMonth}/${licenseExpirationYear}`
              : undefined
          }
        />
        <Fact
          label="Education"
          value={educationSchool}
        />
        <Fact
          label="Degree"
          value={educationDegree}
        />
        <Fact
          label="Graduated"
          value={educationYearGraduated?.toString()}
        />
        <Fact
          label="Years in Practice"
          value={practiceStartYear?.toString()}
        />
      </dl>
    </Card>
  )
}
