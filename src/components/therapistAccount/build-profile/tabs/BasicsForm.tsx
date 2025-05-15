// src/components/therapistAccount/build-profile/tabs/BasicsForm.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import TextField from '@/components/fields/TextField';
import ImageUploadField from '@/components/fields/ImageUploadField';
// Assuming RadioGroup is set up to work with react-hook-form and can be styled as needed
// If not, the manual radio button approach from previous examples can be used.
import RadioGroup from '@/components/fields/RadioGroup';
import { FullTherapistProfile, GENDER_OPTIONS } from '@/lib/schemas/therapistSchema'; // Adjust path if needed
import { Camera } from 'lucide-react'; // Icon for profile photo placeholder

// Prepare gender options for RadioGroup
const genderRadioOptionsForForm = GENDER_OPTIONS.map(g => ({
    label: g.charAt(0).toUpperCase() + g.slice(1).replace(/_/g, ' '), // Formats "prefer_not_to_say" to "Prefer not to say"
    value: g,
}));

export default function BasicsForm() {
  const {
    register,
    formState: { errors },
    watch, // watch is useful for ImageUploadField to get currentImageUrl if needed
  } = useFormContext<FullTherapistProfile>();

  // Common styling for input fields to match Figma
  const figmaInputClassName = "bg-gray-100 border-gray-300 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500";
  // For TextFields, this class should be passed to the <input> element itself,
  // e.g. via an `inputClassName` prop on your `TextField` component.

  return (
    <div className="space-y-8"> {/* Overall spacing between major sections */}

      {/* Image Upload Section - Full Width Beige Background */}
      <div className="bg-[#F0EBE3] p-6 rounded-lg shadow-inner relative min-h-[260px] sm:min-h-[320px] flex flex-col justify-end items-center">
        {/* "Change background" Button - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <ImageUploadField
            name="coverImageUrl" // From Zod schema
            label="Change background"
            isCoverPhotoTrigger={true} // Prop for ImageUploadField to render as small button
            // currentImageUrl={watch('coverImageUrl')} // Pass to show existing image
            triggerClassName="bg-white/80 hover:bg-white text-gray-600 px-3 py-1.5 text-xs font-medium rounded-md shadow-sm backdrop-blur-sm border border-gray-200"
          />
           {/* Error for coverImageUrl is placed below the entire image section for cleaner UI */}
        </div>

        {/* Profile Photo Upload Area - Centered, overlays bottom of beige */}
        <div className="relative z-0 mb-[-50px] sm:mb-[-60px]"> {/* Negative margin to pull it down slightly */}
          <ImageUploadField
            name="imageUrl" // From Zod schema
            label="Profile Photo" // Used as placeholder text or aria-label
            isProfilePhotoUploadArea={true} // Prop for ImageUploadField to render as the central box
            // currentImageUrl={watch('imageUrl')} // Pass to show existing image
            placeholderClassName="w-32 h-40 sm:w-36 sm:h-48 bg-slate-200 rounded-lg shadow-lg border-2 border-white" // Styles for the placeholder box
            placeholderIcon={<Camera size={40} className="text-slate-400" />}
            placeholderText="Upload Photo" // Text for inside the placeholder box
          />
        </div>
      </div>
      {/* Errors for image uploads */}
      {(errors.coverImageUrl || errors.imageUrl) && (
        <div className="pt-12 sm:pt-16 text-center space-y-1"> {/* Adjusted padding top to account for overlapping profile photo */}
            {errors.coverImageUrl && <p className="text-xs text-red-500">Cover Image: {(errors.coverImageUrl as any)?.message}</p>}
            {errors.imageUrl && <p className="text-xs text-red-500">Profile Photo: {(errors.imageUrl as any)?.message}</p>}
        </div>
      )}


      {/* Basics Form Fields Section */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-md space-y-6 mt-12 sm:mt-16"> {/* Added top margin to clear profile photo */}
        <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-200">
          {/* User Icon SVG */}
          <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <h2 className="text-2xl font-semibold text-gray-800">Basics</h2>
        </div>

        <TextField
          label="Name" // All fields are optional as per Zod schema
          name="name"
          register={register}
          placeholder="e.g., Dr. Evelyn Reed"
          error={(errors.name as any)?.message}
          inputClassName={figmaInputClassName}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credentials Following Name
          </label>
          <p className="text-xs text-gray-500 mb-2">e.g. LMFT, Psychotherapist. These appear after your name.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="primaryCredential"
              register={register}
              placeholder="e.g., LMFT"
              error={(errors.primaryCredential as any)?.message}
              inputClassName={figmaInputClassName}
            />
            <TextField
              name="primaryCredentialAlt"
              register={register}
              placeholder="e.g., PhD"
              error={(errors.primaryCredentialAlt as any)?.message}
              inputClassName={figmaInputClassName}
            />
          </div>
        </div>

        {/* My Gender - Using manual radio buttons for precise layout match */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">My gender</label>
          <div className="space-y-2"> {/* Stack radio buttons vertically */}
            {genderRadioOptionsForForm.map(option => (
              <label key={option.value} className="flex items-center cursor-pointer group p-1">
                <input
                  type="radio"
                  id={`gender-${option.value}`} // Unique ID for label association
                  value={option.value}
                  {...register('gender')} // 'gender' must be a field in FullTherapistProfile
                  className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500 focus:ring-offset-1 group-hover:border-teal-500"
                />
                <span className="ml-2.5 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="mt-1 text-xs text-red-600">{(errors.gender as any)?.message}</p>}
        </div>


        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          register={register}
          subLabel="For clients to call"
          placeholder="(555) 123-4567"
          error={(errors.phone as any)?.message}
          inputClassName={figmaInputClassName}
        />

        <TextField
          label="Email - Premium users only"
          name="workEmail"
          type="email"
          register={register}
          subLabel="For clients to email"
          placeholder="you@example.com"
          error={(errors.workEmail as any)?.message}
          inputClassName={figmaInputClassName}
        />

        <TextField
          label="Website"
          name="website"
          type="url"
          register={register}
          placeholder="https://yourpractice.com"
          error={(errors.website as any)?.message}
          inputClassName={figmaInputClassName}
        />
      </div>
    </div>
  );
}