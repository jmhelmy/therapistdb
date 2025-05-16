// src/components/shared/Card.tsx
import React from 'react';

interface CardProps {
  title?: string;
  icon?: React.ReactNode; // For icon next to title
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  actions?: React.ReactNode; // Optional actions area (e.g., an "Edit" button)
}

export default function Card({
  title,
  icon,
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
  actions,
}: CardProps) {
  return (
    <section
      className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-gray-300 ${className}`}
    >
      {(title || actions) && (
        <div className={`px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 print:border-gray-300 flex justify-between items-center ${titleClassName}`}>
          {title && (
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
              {icon && <span className="mr-2.5 text-teal-600 shrink-0">{icon}</span>}
              {title}
            </h3>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={`p-4 sm:p-6 ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}