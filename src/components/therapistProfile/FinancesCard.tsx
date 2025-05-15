// src/components/therapistProfile/FinancesCard.tsx
import Card from '@/components/shared/Card'; // Assuming Card handles title and overall structure
import Section from '@/components/shared/Section'; // Assuming Section handles sub-section title and content
import { CheckCircle, XCircle } from 'lucide-react'; // For boolean display

interface FinancesCardProps {
  therapist: {
    feeIndividual?: string | null;
    feeCouples?: string | null;
    slidingScale?: boolean | null;
    freeConsultation?: boolean | null; // Added this based on your Zod schema
    paymentMethods?: string[] | null;
    insuranceAccepted?: string | null;
    feeComment?: string | null;
  };
}

export default function FinancesCard({ therapist }: FinancesCardProps) {
  const {
    feeIndividual, feeCouples, slidingScale, freeConsultation,
    paymentMethods, insuranceAccepted, feeComment,
  } = therapist;

  const hasData = feeIndividual || feeCouples || slidingScale !== undefined || freeConsultation !== undefined ||
                  (paymentMethods && paymentMethods.length > 0) ||
                  (insuranceAccepted && insuranceAccepted.trim() !== '') ||
                  (feeComment && feeComment.trim() !== '');

  if (!hasData) return null;

  const paymentsDisplay = Array.isArray(paymentMethods) && paymentMethods.length > 0
    ? paymentMethods.join(', ')
    : paymentMethods && typeof paymentMethods === 'string' // Handle if it's a string by mistake
    ? paymentMethods
    : null;

  // Assuming insuranceAccepted is a string, could be comma-separated or a single provider
  const insuranceDisplay = insuranceAccepted && insuranceAccepted.trim() !== '' ? insuranceAccepted.trim() : null;

  const displayFee = (fee: string | null | undefined) => {
    if (!fee || fee.trim() === '') return "Contact for details";
    // If fee doesn't start with '$' and is numeric, prepend it.
    // Handles cases like "150" vs "$150" or "Contact for rates"
    if (!fee.startsWith('$') && /^\d+(\.\d+)?$/.test(fee)) return `$${fee}`;
    return fee;
  };

  return (
    <Card title="Finances & Insurance" icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}>
      <div className="space-y-4">
        {(feeIndividual || feeCouples) && (
          <Section title="Session Fees">
            <ul className="space-y-1 text-sm text-gray-700">
              {feeIndividual && (
                <li>
                  Individual: <span className="font-semibold text-gray-800">{displayFee(feeIndividual)}</span>
                </li>
              )}
              {feeCouples && (
                <li>
                  Couples/Family: <span className="font-semibold text-gray-800">{displayFee(feeCouples)}</span>
                </li>
              )}
            </ul>
          </Section>
        )}

        {(slidingScale !== undefined || freeConsultation !== undefined) && (
          <Section title="Affordability">
            <div className="space-y-1 text-sm">
                {slidingScale !== undefined && (
                    <p className={`flex items-center ${slidingScale ? 'text-green-600' : 'text-gray-600'}`}>
                        {slidingScale ? <CheckCircle size={16} className="mr-2"/> : <XCircle size={16} className="mr-2 text-red-500"/>}
                        Sliding Scale {slidingScale ? 'Available' : 'Not Specified / No'}
                    </p>
                )}
                {freeConsultation !== undefined && (
                     <p className={`flex items-center ${freeConsultation ? 'text-green-600' : 'text-gray-600'}`}>
                        {freeConsultation ? <CheckCircle size={16} className="mr-2"/> : <XCircle size={16} className="mr-2 text-red-500"/>}
                        Free Consultation {freeConsultation ? 'Offered' : 'Not Specified / No'}
                    </p>
                )}
            </div>
          </Section>
        )}


        {paymentsDisplay && (
          <Section title="Payment Methods">
            <p className="text-sm text-gray-700">{paymentsDisplay}</p>
          </Section>
        )}

        {insuranceDisplay && (
          <Section title="Insurance Accepted">
            <p className="text-sm text-gray-700">{insuranceDisplay}</p>
            <p className="text-xs text-gray-500 mt-1">Please verify coverage directly with the therapist.</p>
          </Section>
        )}

        {feeComment && feeComment.trim() !== '' && (
          <Section title="Additional Fee Information">
            <p className="text-sm text-gray-700 whitespace-pre-line">{feeComment}</p>
          </Section>
        )}
      </div>
    </Card>
  );
}