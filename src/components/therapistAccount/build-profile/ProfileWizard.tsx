// src/components/therapistAccount/build-profile/ProfileWizard.tsx
'use client';

import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; // Added useSearchParams, usePathname
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useLoadTherapistData from './hooks/useLoadTherapistData';
import BuildProfileHeader from './BuildProfileHeader';
import StepTabs from './StepTabs';
import WizardFormBody from './WizardFormBody'; // Ensure this imports ClientMagnetAIForm
import StepFooter from './StepFooter';
import LoadingScreen from './LoadingScreen';
import {
  fullTherapistSchema,
  FullTherapistProfile,
  defaultFormData
} from '@/lib/schemas/therapistSchema'; // Adjust path if necessary

// --- MODIFIED TABS ARRAY ---
// Added 'ClientMagnetAI'. Ensure its position is where you want it in the flow.
const TABS = [
  'Basics',
  'Location',
  'Finances',
  'Qualifications',
  'PersonalStatement',
  'ClientMagnetAI', // <<< ADDED 'ClientMagnetAI' TAB
  'Specialties',
  'TreatmentStyle',
] as const;

export type Tab = typeof TABS[number];

// Helper to check if a string is a valid Tab type
const isValidTab = (tab: string | null | undefined): tab is Tab => {
  return TABS.includes(tab as Tab);
};

export default function ProfileWizard() {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const searchParams = useSearchParams(); // Hook to get URL search parameters

  const methods = useForm<FullTherapistProfile>({
    resolver: zodResolver(fullTherapistSchema),
    defaultValues: defaultFormData, // Ensure this includes clientMagnetProfile: null
    mode: 'onBlur',
  });

  const { isLoadingProfile, initialLoadComplete, serverErrorMessage } = useLoadTherapistData(methods);

  // Initialize activeTab from URL search parameter if present and valid, otherwise default to 'Basics'
  const initialTabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTabInternal] = useState<Tab>(() => {
    return isValidTab(initialTabFromUrl) ? initialTabFromUrl : 'Basics';
  });

  // Effect to sync activeTab with URL on initial load or if URL changes externally
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (isValidTab(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTabInternal(tabFromUrl);
    }
    // If no tab in URL when component mounts, and default is 'Basics', ensure URL reflects this.
    // This is optional but good for consistency if you want the URL to always show the tab.
    // else if (!tabFromUrl && activeTab === 'Basics' && initialLoadComplete) {
    //   const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    //   currentSearchParams.set('tab', 'Basics');
    //   router.replace(`${pathname}?${currentSearchParams.toString()}`, { scroll: false });
    // }
  }, [searchParams, activeTab, initialLoadComplete, pathname, router]); // Added dependencies

  const currentIndex = TABS.indexOf(activeTab);
  const isLastStep = currentIndex === TABS.length - 1;

  const watchedId = methods.watch('id');
  const watchedName = methods.watch('name');
  const watchedSlug = methods.watch('slug');
  const watchedPublished = methods.watch('published');

  const currentFormDataForHeader = {
    id: watchedId,
    name: watchedName,
    slug: watchedSlug,
    published: watchedPublished,
  };

  const previewUrl = watchedSlug
    ? `/therapists/${watchedSlug}?preview=true`
    : watchedId
    ? `/therapists/${watchedId}?preview=true`
    : '#';

  // --- NEW: Handler to set active tab and update URL ---
  const handleSetActiveTab = useCallback((tab: Tab) => {
    setActiveTabInternal(tab);
    const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentSearchParams.set('tab', tab);
    // Using router.replace to avoid cluttering browser history with tab changes.
    // Use router.push if you prefer tab changes to be distinct history entries.
    router.replace(`${pathname}?${currentSearchParams.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);


  const onSubmit = async (data: FullTherapistProfile) => {
    console.log('Submitting validated data (ProfileWizard):', data);
    if (!watchedId && !data.id) {
      alert('Profile ID is missing. Cannot save.');
      return;
    }
    const payload = { ...data, id: watchedId || data.id };

    try {
      const res = await fetch('/api/therapists/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = 'Unknown error during save.';
        try { const errRes = await res.json(); message = errRes?.error || errRes?.message || message; }
        catch { /* empty body */ }
        alert(`Failed to save profile: ${message} (Status: ${res.status})`);
        console.error('❌ Save error response:', await res.text());
        return;
      }

      const responseData = await res.json();
      console.log('✅ Profile saved successfully (ProfileWizard):', responseData);
      if (responseData.therapist) {
        methods.reset(responseData.therapist, {
          keepDirtyValues: true,
          keepSubmitCount: true,
          keepIsSubmitted: true,
        });
        console.log('Form updated with server data after save.');
      }

      if (!isLastStep) {
        const nextTab = TABS[currentIndex + 1];
        handleSetActiveTab(nextTab); // <<< USE NEW HANDLER
      } else {
        alert("Profile saved successfully! All steps complete.");
        // Consider router.push('/account') or similar for final step
      }
    } catch (error) {
      alert('Failed to save profile: A network or unexpected error occurred.');
      console.error('❌ Save exception:', error);
    }
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      methods.handleSubmit(onSubmit)(); // This will call onSubmit, which now handles URL update for next tab
    } else {
      console.log("Validation errors:", methods.formState.errors);
      alert("Please correct the errors on the form before continuing.");
    }
  };

  const handleUnpublish = async () => {
    // ... (your existing handleUnpublish logic remains the same) ...
    if (!watchedSlug && !watchedId) return;
    const identifier = watchedSlug || watchedId;
    try {
      const res = await fetch(`/api/therapists/${identifier}/publish`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to unpublish');
      methods.setValue('published', false, { shouldDirty: true, shouldValidate: true });
      console.log('Profile unpublished.');
    } catch (error) {
      console.error("Error unpublishing:", error);
      alert("Failed to unpublish profile.");
    }
  };


  if (isLoadingProfile && !initialLoadComplete) {
    return <LoadingScreen />;
  }
  if (serverErrorMessage && !initialLoadComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-700">{serverErrorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const FOOTER_PADDING_CLASS = "pb-24";

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col min-h-screen bg-slate-50"
      >
        <BuildProfileHeader
          formDataForHeader={currentFormDataForHeader}
          onUnpublish={handleUnpublish}
          previewUrl={previewUrl}
        />

        <main className={`flex-grow max-w-4xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 ${FOOTER_PADDING_CLASS}`}>
          <StepTabs
            tabs={TABS} // Ensure TABS array includes 'ClientMagnetAI'
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab} // <<< USE NEW HANDLER
          />
          <div className="mt-8">
            <WizardFormBody activeTab={activeTab} /> {/* Ensure WizardFormBody handles 'ClientMagnetAI' tab */}
          </div>
        </main>

        <StepFooter
          step={currentIndex + 1}
          tabs={TABS}
          isSaving={methods.formState.isSubmitting}
          back={() => { // <<< USE NEW HANDLER FOR BACK
            if (currentIndex > 0) handleSetActiveTab(TABS[currentIndex - 1]);
          }}
          next={handleNext} // This calls onSubmit which handles setting next tab and URL
        />
      </form>
    </FormProvider>
  );
}