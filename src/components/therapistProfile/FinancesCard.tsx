// src/components/therapistProfile/FinancesCard.tsx
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'

export default function FinancesCard({ therapist }: { therapist: any }) {
  const {
    feeIndividual,
    feeCouples,
    slidingScale,
    paymentMethods,
    insuranceAccepted,
    feeComment,
  } = therapist

  // If absolutely nothing here, don’t render the card at all
  const hasData =
    feeIndividual ||
    feeCouples ||
    slidingScale ||
    (paymentMethods && paymentMethods.length > 0) ||
    (insuranceAccepted && insuranceAccepted.length > 0) ||
    feeComment

  if (!hasData) return null

  // Normalize arrays/strings
  const payments = Array.isArray(paymentMethods)
    ? paymentMethods.join(', ')
    : paymentMethods

  const insurances = Array.isArray(insuranceAccepted)
    ? insuranceAccepted.join(', ')
    : insuranceAccepted

  return (
    <Card title="Finances">
      {/* Fees always show if either fee exists */}
      {(feeIndividual || feeCouples) && (
        <Section title="Fees">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {feeIndividual && (
              <li>
                Individual Sessions{' '}
                <span className="font-medium">${feeIndividual}</span>
              </li>
            )}
            {feeCouples && (
              <li>
                Couple Sessions{' '}
                <span className="font-medium">${feeCouples}</span>
              </li>
            )}
          </ul>
        </Section>
      )}

      {/* Sliding Scale only if true */}
      {slidingScale && (
        <Section title="Sliding Scale">
          <p className="text-sm text-teal-600">Yes</p>
        </Section>
      )}

      {/* Payment Methods only if provided */}
      {payments && (
        <Section title="Payment Methods">
          <p className="text-sm">{payments}</p>
        </Section>
      )}

      {/* Insurance only if provided */}
      {insurances && (
        <Section title="Insurance">
          <p className="text-sm">{insurances}</p>
        </Section>
      )}

      {/* Fee comment only if provided */}
      {feeComment && (
        <Section title="Note on Finance">
          <p className="text-sm">{feeComment}</p>
        </Section>
      )}
    </Card>
  )
}
