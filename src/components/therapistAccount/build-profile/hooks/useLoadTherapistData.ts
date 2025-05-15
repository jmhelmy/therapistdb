// src/components/therapistAccount/build-profile/hooks/useLoadTherapistData.ts
'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FullTherapistProfile, defaultFormData } from '@/lib/schemas/therapistSchema';

export default function useLoadTherapistData(methods: UseFormReturn<FullTherapistProfile>) {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialLoadComplete) return;

    const load = async () => {
      setIsLoadingProfile(true);
      setServerErrorMessage(null);
      console.log("useLoadTherapistData: Attempting to load profile...");
      try {
        const res = await fetch('/api/therapists/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) { // Handles 404 for new user, or other server errors
          const errorText = await res.text();
          console.warn(`⚠️ Failed to fetch profile data (Status: ${res.status}). Assuming new profile or error. Response:`, errorText);
          setServerErrorMessage(`Profile not found or error loading (Status: ${res.status}). Starting with a new profile form.`);
          console.log("useLoadTherapistData: Resetting with defaultFormData. ID in defaultFormData:", defaultFormData.id);
          methods.reset(defaultFormData); // id will be `undefined`
          return;
        }

        const data = await res.json();

        if (!data || typeof data !== 'object' ) {
            console.warn('⚠️ API returned invalid data structure. Using defaults.', data);
            setServerErrorMessage('Received invalid profile data from server. Starting with a new profile form.');
            methods.reset(defaultFormData); // id will be `undefined`
            return;
        }
        
        const therapistData = data.therapist || data; // Handle nested or direct object

        // Critical check for the ID from the fetched data
        const fetchedId = therapistData.id;
        console.log('✅ Profile data received from API. Fetched ID:', fetchedId, '(type:', typeof fetchedId + ')');

        if (!fetchedId || typeof fetchedId !== 'string' || fetchedId.trim() === '') {
          // This case means an existing record was found but its ID is missing, empty, or not a string.
          // This is unusual for an existing record but could happen if data is corrupt OR
          // if the API returns an object with no 'id' for a "new profile" scenario instead of a 404.
          console.warn('⚠️ Fetched therapist data is missing a valid string ID. Treating as new profile. ID was:', fetchedId);
          setServerErrorMessage('Loaded profile data is incomplete (missing ID). Starting with a new profile form.');
          methods.reset(defaultFormData); // id will be `undefined`
          return;
        }

        // At this point, therapistData.id is a non-empty string.
        // Zod will later validate if it's a CUID.
        console.log('✅ Preparing to reset form with fetched therapist data. ID:', fetchedId);

        const dataToReset: FullTherapistProfile = {
          ...defaultFormData, // Start with Zod defaults (id is undefined here)
          ...therapistData,   // Override with fetched data (id from therapistData will overwrite defaultFormData.id)
          
          // Explicitly set the ID from fetched data, ensuring it's a string.
          // If therapistData.id was valid, it's used. If somehow still problematic, it will become undefined here if not a string.
          // However, the check above should already ensure therapistData.id is a non-empty string here.
          id: therapistData.id, // This should be the valid CUID string from an existing profile

          // Normalize array fields
          paymentMethods: Array.isArray(therapistData.paymentMethods) ? therapistData.paymentMethods : [],
          issues: Array.isArray(therapistData.issues) ? therapistData.issues : [],
          languages: Array.isArray(therapistData.languages) ? therapistData.languages : [],
          ages: Array.isArray(therapistData.ages) ? therapistData.ages : [],
          participants: Array.isArray(therapistData.participants) ? therapistData.participants : [],
          communities: Array.isArray(therapistData.communities) ? therapistData.communities : [],
          treatmentStyle: Array.isArray(therapistData.treatmentStyle) ? therapistData.treatmentStyle : [],
          topIssues: Array.isArray(therapistData.topIssues) ? therapistData.topIssues : [],
          // Ensure all other array fields are handled:
          // clientConcerns, mentalHealth, sexuality, faith (if these are separate fields from your Zod schema)
          // Assuming they are named mentalHealthInterests etc. in FullTherapistProfile as per Zod
          mentalHealthInterests: Array.isArray(therapistData.mentalHealthInterests) ? therapistData.mentalHealthInterests : [],
          sexualityInterests: Array.isArray(therapistData.sexualityInterests) ? therapistData.sexualityInterests : [],
          faithInterests: Array.isArray(therapistData.faithInterests) ? therapistData.faithInterests : [],


          // Normalize numeric fields (ensure they are numbers or null for Zod)
          licenseExpirationMonth: therapistData.licenseExpirationMonth ? Number(therapistData.licenseExpirationMonth) : null,
          licenseExpirationYear: therapistData.licenseExpirationYear ? Number(therapistData.licenseExpirationYear) : null,
          educationYearGraduated: therapistData.educationYearGraduated ? Number(therapistData.educationYearGraduated) : null,
          practiceStartYear: therapistData.practiceStartYear ? Number(therapistData.practiceStartYear) : null,

          // Ensure string fields that Zod expects as strings are indeed strings (or null/"" if allowed by Zod)
          // Your optionalNullableString allows null or "", so `therapistData.fieldName || null` or `therapistData.fieldName || ""` is fine.
          // For name (optionalStringCannotBeNull):
          name: therapistData.name || '', // Ensure name is '' if null/undefined from API

          feeIndividual: therapistData.feeIndividual || '', // Default to empty string if null/undefined
          feeCouples: therapistData.feeCouples || '',     // Default to empty string if null/undefined
          // ... ensure other string fields are handled if they might be null from API but Zod expects string or ""
        };
        console.log("useLoadTherapistData: Final dataToReset.id for existing profile:", dataToReset.id);
        methods.reset(dataToReset);

      } catch (err: any) {
        console.error('❌ Error loading therapist profile data (in catch block):', err);
        setServerErrorMessage(`An unexpected error occurred while loading your profile: ${err.message}`);
        console.log("useLoadTherapistData: Resetting with defaultFormData due to CATCH block. ID in defaultFormData:", defaultFormData.id);
        methods.reset(defaultFormData); // id will be `undefined`
      } finally {
        setIsLoadingProfile(false);
        setInitialLoadComplete(true);
      }
    };

    if (methods && methods.reset) {
      load();
    } else {
      console.error("useLoadTherapistData: 'methods' or 'methods.reset' is not available on initial call.");
      setIsLoadingProfile(false); // Prevent infinite loading if methods aren't ready
      setInitialLoadComplete(true); // Mark as complete to prevent re-trigger if methods become available later
    }
  }, [methods, initialLoadComplete]); // `methods` can be a dependency if its reference stability is guaranteed by RHF

  return { isLoadingProfile, initialLoadComplete, serverErrorMessage };
}