// src/components/therapistAccount/build-profile/tabs/BasicsForm.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import TextField from '@/components/fields/TextField'; // Assuming this is responsive and styles input with w-full
import ImageUploadField from '@/components/fields/ImageUploadField'; // Assuming this is responsive
import { FullTherapistProfile, GENDER_OPTIONS } from '@/lib/schemas/therapistSchema';
import { Camera, User } from 'lucide-react'; // Changed User icon import for consistency

// Prepare gender options
const genderRadioOptionsForForm = GENDER_OPTIONS.map(g => ({
  label: g.charAt(0).toUpperCase() + g.slice(1).replace(/_/g, ' '),
  value: g,
}));

export default function BasicsForm() {
  const {
    register,
    formState: { errors },
    // watch, // Uncomment if/when ImageUploadField needs currentImageUrl
  } = useFormContext<FullTherapistProfile>();

  const figmaInputClassName = "bg-gray-100 border-gray-300 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500 text-sm";
  // Added text-sm to ensure consistent input text size. TextField should apply this.

  return (
    // Consider responsive vertical spacing if too much on small screens:
    // e.g., className="space-y-6 sm:space-y-8"
    <div className="space-y-8">

      {/* Image Upload Section */}
      {/* Consider adjusting min-h for very small screens if needed */}
      <div className="bg-[#F0EBE3] p-4 sm:p-6 rounded-lg shadow-inner relative min-h-[240px] sm:min-h-[300px] md:min-h-[320px] flex flex-col justify-end items-center">
        {/* "Change background" Button */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
          <ImageUploadField
            name="coverImageUrl"
            label="Change background"
            isCoverPhotoTrigger={true}
            // currentImageUrl={watch('coverImageUrl')}
            // Responsive trigger button styling:
            triggerClassName="bg-white/80 hover:bg-white text-gray-600 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium rounded-md shadow-sm backdrop-blur-sm border border-gray-200"
          />
        </div>

        {/* Profile Photo Upload Area */}
        {/* The negative margin pulls the photo down. Test this carefully on different mobile screen heights.
            The amount it hangs down (-50px / -60px) should visually integrate with the mt-12/mt-16 of the form below.
            Ensure placeholder size is good for mobile tap targets.
        */}
        <div className="relative z-0 mb-[-50px] sm:mb-[-60px]">
          <ImageUploadField
            name="imageUrl"
            label="Profile Photo"
            isProfilePhotoUploadArea={true}
            // currentImageUrl={watch('imageUrl')}
            // Responsive placeholder size:
            placeholderClassName="w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-48 bg-slate-200 rounded-lg shadow-lg border-2 border-white"
            placeholderIcon={<Camera size={32} sm:size={40} className="text-slate-400" />} // Responsive icon size
            placeholderText="Upload Photo"
            placeholderTextClassName="text-xs sm:text-sm" // Responsive text size
          />
        </div>
      </div>
      {/* Errors for image uploads */}
      {/* The pt (padding-top) here needs to be enough to clear the overhanging profile photo */}
      {/* Make this padding responsive if the overhang amount changes responsively */}
      {(errors.coverImageUrl || errors.imageUrl) && (
        <div className="pt-[60px] sm:pt-[70px] text-center space-y-1"> {/* Adjust based on actual overhang */}
            {errors.coverImageUrl && <p className="text-xs text-red-500">Cover Image: {(errors.coverImageUrl as any)?.message}</p>}
            {errors.imageUrl && <p className="text-xs text-red-500">Profile Photo: {(errors.imageUrl as any)?.message}</p>}
        </div>
      )}


      {/* Basics Form Fields Section */}
      {/* The mt (margin-top) here needs to be enough to clear the overhanging profile photo PLUS any error messages above it. */}
      {/* Or, if error messages are rare, ensure the default state looks good. */}
      {/* Let's assume the error messages div above has enough padding to clear the photo. */}
      {/* If no errors, the effective top margin for this card comes from the previous section's bottom (accounting for negative margin) */}
      {/* The `space-y-8` on the root div plus the natural flow will handle some of this, but explicit margin might be needed if errors are not present. */}
      {/* Given the error message div has pt-[60px], this card should just have a small margin from that error div or the image section if no errors */}
      <div className={`bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow-md space-y-4 sm:space-y-6 ${ (errors.coverImageUrl || errors.imageUrl) ? 'mt-4' : 'mt-[70px] sm:mt-[80px]' }`}>
        {/* Adjusted top margin to mt-4 if errors are present, or a larger margin to clear the photo if no image errors */}
        <div className="flex items-center space-x-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
          <User size={24} sm:size={28} className="text-teal-600" /> {/* Using Lucide User icon */}
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Basics</h2>
        </div>

        <TextField
          label="Name"
          name="name"
          register={register}
          placeholder="e.g., Dr. Evelyn Reed"
          error={(errors.name as any)?.message}
          inputClassName={figmaInputClassName} // This class should ensure w-full and text-sm
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credentials Following Name
          </label>
          <p className="text-xs text-gray-500 mb-2">e.g. LMFT, PhD. These appear after your name.</p>
          {/* This grid is already responsive, which is great! */}
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
              placeholder="e.g., MA"
              error={(errors.primaryCredentialAlt as any)?.message}
              inputClassName={figmaInputClassName}
            />
          </div>
        </div>

        {/* My Gender - Radio buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">My gender</label>
          {/* Stack radio buttons vertically, good for mobile. Ensure tap targets are sufficient. */}
          <div className="space-y-1 sm:space-y-2">
            {genderRadioOptionsForForm.map(option => (
              <label key={option.value} className="flex items-center cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  id={`gender-${option.value}`}
                  value={option.value}
                  {...register('gender')}
                  className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500 focus:ring-offset-1 group-hover:border-teal-400"
                />
                <span className="ml-2 sm:ml-2.5 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
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
          subLabel="For clients to call you (optional)"
          placeholder="(555) 123-4567"
          error={(errors.phone as any)?.message}
          inputClassName={figmaInputClassName}
        />

        <TextField
          label="Work Email" // Assuming "Premium users only" is handled by feature flags/UI elsewhere
          name="workEmail"
          type="email"
          register={register}
          subLabel="For clients to email you (optional)"
          placeholder="you@example.com"
          error={(errors.workEmail as any)?.message}
          inputClassName={figmaInputClassName}
        />

        <TextField
          label="Your Website"
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