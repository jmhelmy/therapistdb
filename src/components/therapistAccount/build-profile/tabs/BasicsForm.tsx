// src/components/therapistAccount/build-profile/tabs/BasicsForm.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import TextField from '@/components/fields/TextField';
import ImageUploadField from '@/components/fields/ImageUploadField';
import RadioGroup from '@/components/fields/RadioGroup'; // Assuming this is your component
import { FullTherapistProfile, GENDER_OPTIONS } from '@/lib/schemas/therapistSchema'; // Adjust path

// Prepare gender options for RadioGroup
const genderRadioOptionsForForm = GENDER_OPTIONS.map(g => ({
    label: g.charAt(0).toUpperCase() + g.slice(1).replace(/_/g, ' '),
    value: g,
}));

export default function BasicsForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FullTherapistProfile>();

  const figmaInputClassName = "bg-gray-50 border-gray-300 placeholder-gray-400";

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Change background</p>
            <ImageUploadField
              name="coverImageUrl" // Field name from Zod schema
              // Props for ImageUploadField to style as a dashed box
            />
            {errors.coverImageUrl && <p className="mt-1 text-xs text-red-500">{(errors.coverImageUrl as any)?.message}</p>}
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Profile photo</p>
            <ImageUploadField
              name="imageUrl" // Field name from Zod schema
            />
            {errors.imageUrl && <p className="mt-1 text-xs text-red-500">{(errors.imageUrl as any)?.message}</p>}
          </div>
        </div>
      </div>

      {/* Basics Form Fields Section */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-200">
          <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <h2 className="text-2xl font-semibold text-gray-800">Basics</h2>
        </div>

        <TextField
          label="Name" // Removed asterisk
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">My gender</label>
          <div className="space-y-2 pl-1">
            {genderRadioOptionsForForm.map(option => (
              <label key={option.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  id={`gender-${option.value}`}
                  value={option.value}
                  {...register('gender')}
                  className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500 focus:ring-offset-0 group-hover:border-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="mt-1 text-xs text-red-600 pl-1">{(errors.gender as any)?.message}</p>}
        </div>

        <TextField
          label="Phone number" // Removed asterisk
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