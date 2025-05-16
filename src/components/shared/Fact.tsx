// src/components/shared/Fact.tsx
import React from 'react';

interface FactProps {
  label: string;
  value?: string | number | null | React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export const Fact: React.FC<FactProps> = ({
  label,
  value,
  className = '',
  labelClassName = 'text-gray-600',
  valueClassName = 'text-gray-800 font-medium',
}) => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return null; // Don't render if value is empty
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 py-1.5 ${className}`}>
      <dt className={`w-full sm:w-2/5 md:w-1/3 shrink-0 ${labelClassName}`}>{label}:</dt>
      <dd className={`w-full sm:w-3/5 md:w-2/3 ${valueClassName}`}>{value}</dd>
    </div>
  );
};