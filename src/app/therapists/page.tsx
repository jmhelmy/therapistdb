// src/app/therapists/page.tsx
export const dynamic = 'force-dynamic';

import { generatePageMetadata } from './metadata';
import { getTherapistsPageData } from './therapist-data';
import { buildPageIntro } from './page-intro';
import TherapistList from '@/components/TherapistList/TherapistList';
import { SearchParams } from './types';

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  return generatePageMetadata({ searchParams });
}

export default async function TherapistsPage({ searchParams }: { searchParams: SearchParams }) {
  const {
    therapists,
    reasonMap,
    aiError,
    totalTherapistsCount,
    totalPages,
    currentPage,
    currentZip,
    currentIssueForAI,
  } = await getTherapistsPageData(searchParams);

  const { title, subtitle, contentBlurb } = buildPageIntro(searchParams);

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 sm:pt-12">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 !leading-tight">
            {title}
          </h1>
          <p className="text-md sm:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            {subtitle}
          </p>
        </header>

        {contentBlurb && (
          <section className="mb-10 md:mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: contentBlurb }} />
            </div>
          </section>
        )}

        <TherapistList
          therapists={therapists.filter(t => t.slug)}
          reasonMap={reasonMap}
          aiError={aiError}
          totalTherapistsCount={totalTherapistsCount}
          totalPages={totalPages}
          currentPage={currentPage}
          searchParamsObject={Object.fromEntries(
            Object.entries(searchParams).filter(([k]) => k !== 'page' && typeof searchParams[k] === 'string')
          )}
          currentZip={currentZip}
          currentIssue={currentIssueForAI}
          showAiSuggestions={!!currentIssueForAI && !aiError}
        />
      </div>
    </div>
  );
}
