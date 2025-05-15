// components/TherapistList.tsx
'use client';

import ClientFilters from './ClientFilters';
import IssueForm from './IssueForm';
import TherapistCard, { TherapistDataForCard } from './TherapistCard'; // Use the exported type
import Pagination from './Pagination';

// Re-export or use TherapistDataForCard as the type for therapists array
type Therapist = TherapistDataForCard;

interface TherapistListProps {
  therapists: Therapist[];
  reasonMap: Map<string, string>;
  aiError: string | null;
  totalTherapistsCount: number;
  totalPages: number;
  currentPage: number;
  searchParamsObject: { [key: string]: string | undefined }; // For Pagination and IssueForm
  currentZip?: string;
  currentIssue?: string;
}

export default function TherapistList({
  therapists,
  reasonMap,
  aiError,
  totalTherapistsCount,
  totalPages,
  currentPage,
  searchParamsObject,
  currentZip,
  currentIssue,
}: TherapistListProps) {

  return (
    <>
      {/* ClientFilters uses useSearchParams internally, so no direct props needed for its core function */}
      <ClientFilters />
      {/* IssueForm needs currentZip and currentPage to build its query string upon submission */}
      <IssueForm zip={currentZip} page={currentPage} />

      {aiError && (
        <div className="my-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md text-center">
          <p><strong>AI Ranking Notice:</strong> {aiError} Displaying default results.</p>
        </div>
      )}

      <div className="text-gray-600 text-center mb-6">
        Showing {therapists.length > 0 ? therapists.length.toLocaleString() : '0'} of {totalTherapistsCount.toLocaleString()} result{totalTherapistsCount !== 1 && 's'}
        {currentZip && ` near ${currentZip}`}
        {currentIssue && ` related to "${currentIssue}"`}
      </div>

      {therapists.length === 0 && totalTherapistsCount > 0 && (
        <p className="text-center text-gray-700 py-8">No therapists match your current filters for this page. Try adjusting your search or going to a different page.</p>
      )}
      {totalTherapistsCount === 0 && (
        <p className="text-center text-gray-700 py-8">No therapists currently match your search criteria. Please try broadening your search.</p>
      )}

      {therapists.length > 0 && (
        <ul className="space-y-6">
          {therapists.map(therapist => (
            <li key={therapist.id}>
              <TherapistCard therapist={therapist} />
              {reasonMap.has(therapist.id) && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm shadow">
                  <strong className="font-semibold">AI Suggestion:</strong> {reasonMap.get(therapist.id)}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          basePath="/therapists"
          // Pass a simplified query object for pagination to reconstruct URLs
          query={searchParamsObject}
        />
      )}
    </>
  );
}