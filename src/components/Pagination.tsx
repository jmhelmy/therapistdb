'use client';

import Link from 'next/link';
import React from 'react';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  basePath: string; // e.g. '/therapists'
  query?: Record<string, string | undefined>;
};

export default function Pagination({
  totalPages,
  currentPage,
  basePath,
  query = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildLink = (page: number) => {
    const params = new URLSearchParams({ ...query, page: page.toString() });
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages
  );

  return (
    <nav
      className="flex items-center justify-center space-x-2 mt-8"
      aria-label="Pagination"
    >
      <Link
        href={buildLink(currentPage - 1)}
        className={`p-2 rounded ${
          currentPage === 1
            ? 'text-gray-400 pointer-events-none'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
        rel="prev"
      >
        ←
      </Link>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showEllipsis = prev && p - prev > 1;

        return (
          <React.Fragment key={p}>
            {showEllipsis && <span className="px-2 text-gray-400">…</span>}
            <Link
              href={buildLink(p)}
              className={`px-3 py-1 rounded ${
                p === currentPage
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p}
            </Link>
          </React.Fragment>
        );
      })}

      <Link
        href={buildLink(currentPage + 1)}
        className={`p-2 rounded ${
          currentPage === totalPages
            ? 'text-gray-400 pointer-events-none'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
        rel="next"
      >
        →
      </Link>
    </nav>
  );
}
