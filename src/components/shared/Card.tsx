// src/components/shared/Card.tsx
import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode; // Optional icon
  children: React.ReactNode;
  className?: string; // Allow passing additional classes for the outer div
  titleClassName?: string; // Allow custom styling for the title
  contentClassName?: string; // Allow custom styling for the content area
}

export default function Card({
  title,
  icon,
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
}: CardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 ${className}`}> {/* Slightly more pronounced shadow/border and rounding */}
      <div className="flex items-center mb-4 pb-3 border-b border-gray-200"> {/* Title section with bottom border */}
        {icon && <span className="mr-3 text-teal-600">{icon}</span>} {/* Icon styling */}
        <h3 className={`font-semibold text-xl text-gray-800 ${titleClassName}`}> {/* Larger title */}
          {title}
        </h3>
      </div>
      <div className={`space-y-3 text-sm text-gray-700 ${contentClassName}`}> {/* Slightly different text color for content */}
        {children}
      </div>
    </div>
  );
}