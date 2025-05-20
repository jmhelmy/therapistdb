// src/components/therapistAccount/build-profile/ProfileWizard.tsx
"use client";
import cuid from "cuid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLoadTherapistData from "./hooks/useLoadTherapistData";
import BuildProfileHeader from "./BuildProfileHeader";
import StepTabs from "./StepTabs";
import WizardFormBody from "./WizardFormBody";
import StepFooter from "./StepFooter";
import LoadingScreen from "./LoadingScreen";
import {
  fullTherapistSchema,
  FullTherapistProfile,
  defaultFormData,
} from "@/lib/schemas/therapistSchema"; // Adjust path if necessary

const TABS = [
  "Basics",
  "Location",
  "Finances",
  "Qualifications",
  "PersonalStatement",
  "Specialties",
  "TreatmentStyle",
] as const;

export type Tab = (typeof TABS)[number];

export default function ProfileWizard() {
  const methods = useForm<FullTherapistProfile>({
    resolver: zodResolver(fullTherapistSchema),
    defaultValues: defaultFormData,
    mode: "onBlur",
  });

  const { isLoadingProfile, initialLoadComplete, serverErrorMessage } =
    useLoadTherapistData(methods);

  const [activeTab, setActiveTab] = useState<Tab>("Basics");
  const currentIndex = TABS.indexOf(activeTab);
  const isLastStep = currentIndex === TABS.length - 1; // Renamed from isLast for clarity

  const watchedId = methods.watch("id");
  const watchedName = methods.watch("name");
  const watchedSlug = methods.watch("slug");
  const watchedPublished = methods.watch("published");

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
    : "#";

  const onSubmit = async (data: FullTherapistProfile) => {
    // console.log("Submitting validated data:", data);
    if (!watchedId && !data.id) {
      alert("Profile ID is missing. Cannot save.");
      return;
    }

    // Ensure insuranceAccepted is an array
    // Ensure insuranceAccepted is always an array

    const payload = {
      ...data,
      id: watchedId || data.id || cuid(),
    };

    // Ensure ID is always present

    try {
      const res = await fetch("/api/therapists/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Unknown error during save.";
        try {
          const errRes = await res.json();
          message = errRes?.error || errRes?.message || message;
        } catch {
          /* empty body */
        }
        // alert(`Failed to save profile: ${message} (Status: ${res.status})`);
        console.log("Save error:", message);
        console.error("❌ Save error response:", await res.text());
        return;
      }

      const responseData = await res.json();
      console.log("✅ Profile saved successfully:", responseData);
      if (responseData.therapist) {
        methods.reset(responseData.therapist, {
          keepDirtyValues: true, // Keep changes user made since last save if server doesn't return them
          keepSubmitCount: true,
          keepIsSubmitted: true,
          // keepValues: true, // Might be useful if server only returns partial data
        });
        console.log("Form updated with server data after save.");
      }

      if (!isLastStep) {
        setActiveTab(TABS[currentIndex + 1]);
      } else {
        alert("Profile saved successfully! All steps complete.");
        // Consider router.push('/account') or similar for final step
      }
    } catch (error) {
      // alert("Failed to save profile: A network or unexpected error occurred.");
      console.log("❌ Save exception:", error);
    }
  };

  const handleNext = async () => {
    const isValid = await methods.trigger(); // Validate all fields (or current tab's fields)
    if (isValid) {
      methods.handleSubmit(onSubmit)();
    } else {
      console.log("Validation errors:", methods.formState.errors);
      // Optionally, find the first field with an error and scroll to it.
      // Or simply rely on RHF showing errors within the form.
      alert("Please correct the errors on the form before continuing.");
    }
  };

  const handleUnpublish = async () => {
    if (!watchedSlug && !watchedId) return;
    const identifier = watchedSlug || watchedId;
    try {
      const res = await fetch(`/api/therapists/${identifier}/publish`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to unpublish");
      methods.setValue("published", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
      console.log("Profile unpublished.");
    } catch (error) {
      console.error("Error unpublishing:", error);
      alert("Failed to unpublish profile.");
    }
  };

  // Apply overall page background in a higher-level layout or via global CSS.
  // For this component, we assume it's placed on a page with the desired light grey background.
  // e.g., in your src/app/build-profile/page.tsx or src/app/layout.tsx: <body className="bg-slate-100">

  if (isLoadingProfile && !initialLoadComplete) {
    return <LoadingScreen />;
  }
  if (serverErrorMessage && !initialLoadComplete) {
    // Show server error only if it's an initial load problem
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading Profile
          </h2>
          <p className="text-gray-700">{serverErrorMessage}</p>
          <button
            onClick={() => window.location.reload()} // Simple reload attempt
            className="mt-6 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Define footer height for padding. Adjust this based on your StepFooter's actual height.
  // Common heights: 16 (64px), 20 (80px), 24 (96px).
  // StepFooter has py-4 (32px) + button height + border. Let's assume ~80px, so pb-20 or pb-24.
  const FOOTER_PADDING_CLASS = "pb-24"; // 96px padding for footer

  return (
    <FormProvider {...methods}>
      {/* The form now wraps the entire structure including header and footer */}
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col min-h-screen bg-slate-50" // Main background if not set globally
      >
        <BuildProfileHeader
          formDataForHeader={currentFormDataForHeader}
          onUnpublish={handleUnpublish}
          previewUrl={previewUrl}
        />

        {/* Main content area that scrolls, with padding for the fixed footer */}
        <main
          className={`flex-grow max-w-4xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 ${FOOTER_PADDING_CLASS}`}
        >
          <StepTabs
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="mt-8">
            {/* WizardFormBody renders the active tab's form (e.g., BasicsForm) */}
            {/* These forms (BasicsForm, etc.) will have their own bg-white, shadow, padding */}
            <WizardFormBody activeTab={activeTab} />
          </div>
        </main>

        <StepFooter
          step={currentIndex + 1}
          tabs={TABS as any}
          isSaving={methods.formState.isSubmitting}
          back={() => {
            if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1]);
          }}
          next={handleNext}
        />
      </form>
    </FormProvider>
  );
}
