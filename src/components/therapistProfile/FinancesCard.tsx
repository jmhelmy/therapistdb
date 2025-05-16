// src/components/therapistProfile/FinancesCard.tsx
import Card from '@/components/shared/Card';
import Section from '@/components/shared/Section';
import { CheckCircle, XCircle, DollarSign, CreditCard, FileText } from 'lucide-react';

interface FinancesCardProps {
  therapist: {
    feeIndividual?: string | null;
    feeCouples?: string | null;
    slidingScale?: boolean | null;
    freeConsultation?: boolean | null;
    paymentMethods?: string[] | null;
    insuranceAccepted?: string | null; // Assuming this can be a list or a descriptive string
    feeComment?: string | null;
  };
}

export default function FinancesCard({ therapist }: FinancesCardProps) {
  const {
    feeIndividual, feeCouples, slidingScale, freeConsultation,
    paymentMethods, insuranceAccepted, feeComment,
  } = therapist;

  // Check if any piece of financial info exists
  const hasAnyData = [feeIndividual, feeCouples, slidingScale, freeConsultation, paymentMethods, insuranceAccepted, feeComment].some(
    val => val !== null && val !== undefined && (Array.isArray(val) ? val.length > 0 : String(val).trim() !== '')
  );
  if (!hasAnyData) return null;

  const paymentsDisplay = Array.isArray(paymentMethods) && paymentMethods.length > 0
    ? paymentMethods.filter(p => p && p.trim() !== '').join(' / ')
    : null;

  const insuranceDisplay = insuranceAccepted && insuranceAccepted.trim() !== '' ? insuranceAccepted.trim() : null;

  const displayFee = (fee: string | null | undefined, sessionType: string) => {
    if (!fee || fee.trim() === '') return null; // Return null if no fee to show
    const feeValue = (!fee.startsWith('$') && /^\d+(\.\d+)?$/.test(fee)) ? `$${fee}` : fee;
    return <p><span className="font-medium">{sessionType}:</span> {feeValue}</p>;
  };

  return (
    <Card title="Fees & Insurance" icon={<DollarSign size={20} className="text-teal-600" />}>
      <div className="space-y-5 text-sm">
        {(feeIndividual || feeCouples) && (
          <Section title="Session Fees" titleClassName="text-sm font-semibold text-gray-700 mb-1.5">
            <div className="space-y-1 text-gray-700">
              {displayFee(feeIndividual, "Individual")}
              {displayFee(feeCouples, "Couples/Family")}
            </div>
          </Section>
        )}

        {(slidingScale !== undefined || freeConsultation !== undefined) && (
          <Section title="Affordability Options" titleClassName="text-sm font-semibold text-gray-700 mb-1.5">
            <div className="space-y-1.5">
                {slidingScale !== null && slidingScale !== undefined && (
                    <p className={`flex items-center ${slidingScale ? 'text-green-700' : 'text-red-600'}`}>
                        {slidingScale ? <CheckCircle size={16} className="mr-2 shrink-0"/> : <XCircle size={16} className="mr-2 shrink-0"/>}
                        Sliding Scale {slidingScale ? 'Available' : 'Not Offered'}
                    </p>
                )}
                {freeConsultation !== null && freeConsultation !== undefined && (
                     <p className={`flex items-center ${freeConsultation ? 'text-green-700' : 'text-red-600'}`}>
                        {freeConsultation ? <CheckCircle size={16} className="mr-2 shrink-0"/> : <XCircle size={16} className="mr-2 shrink-0"/>}
                        Free Initial Consultation {freeConsultation ? 'Offered' : 'Not Offered'}
                    </p>
                )}
            </div>
          </Section>
        )}

        {paymentsDisplay && (
          <Section title="Payment Methods" icon={<CreditCard size={16} className="mr-1.5 text-gray-500"/>} titleClassName="text-sm font-semibold text-gray-700 mb-1.5">
            <p className="text-gray-700">{paymentsDisplay}</p>
          </Section>
        )}

        {insuranceDisplay && (
          <Section title="Insurance" icon={<FileText size={16} className="mr-1.5 text-gray-500"/>} titleClassName="text-sm font-semibold text-gray-700 mb-1.5">
            <p className="text-gray-700 whitespace-pre-wrap">{insuranceDisplay}</p> {/* pre-wrap for newlines in insurance string */}
            <p className="text-xs text-gray-500 mt-1.5">Always verify coverage directly with the therapist before your first session.</p>
          </Section>
        )}

        {feeComment && feeComment.trim() !== '' && (
          <Section title="Additional Fee Information" titleClassName="text-sm font-semibold text-gray-700 mb-1.5">
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{feeComment}</p>
          </Section>
        )}
      </div>
    </Card>
  );
}