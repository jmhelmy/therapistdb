// src/components/therapistAccount/build-profile/tabs/LocationForm.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import TextField from '@/components/fields/TextField';
import TextareaField from '@/components/fields/TextareaField';
import { FullTherapistProfile } from '@/lib/schemas/therapistSchema'; // Adjust path if necessary

export default function LocationForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FullTherapistProfile>();

  const figmaInputClassName = "bg-gray-50 border-gray-300 placeholder-gray-400";
  const checkboxLabelStyles = "flex items-center cursor-pointer group w-fit";
  const checkboxInputStyles = "h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-offset-1 group-hover:border-teal-400";
  const checkboxTextStyles = "ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900";


  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
        <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <h2 className="text-2xl font-semibold text-gray-800">Location</h2>
      </div>

      {/* Primary Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Primary Location</h3>
        <TextField
          name="primaryAddress"
          label="Address"
          register={register}
          placeholder="Street Address, Apt, Suite, etc."
          error={(errors.primaryAddress as any)?.message}
          inputClassName={figmaInputClassName}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            name="primaryCity"
            label="City"
            register={register}
            placeholder="City"
            error={(errors.primaryCity as any)?.message}
            inputClassName={figmaInputClassName}
          />
          <TextField
            name="primaryState"
            label="State"
            register={register}
            placeholder="State / Province"
            error={(errors.primaryState as any)?.message}
            inputClassName={figmaInputClassName}
          />
          <TextField
            name="primaryZip"
            label="ZIP / Postal Code"
            register={register}
            placeholder="ZIP / Postal"
            error={(errors.primaryZip as any)?.message}
            inputClassName={figmaInputClassName}
          />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Additional Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Additional Location <span className="text-sm font-normal text-gray-500">(optional)</span></h3>
        <TextField
          name="additionalAddress"
          label="Address"
          register={register}
          placeholder="Street Address, Apt, Suite, etc."
          error={(errors.additionalAddress as any)?.message}
          inputClassName={figmaInputClassName}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            name="additionalCity"
            label="City"
            register={register}
            placeholder="City"
            error={(errors.additionalCity as any)?.message}
            inputClassName={figmaInputClassName}
          />
          <TextField
            name="additionalState"
            label="State"
            register={register}
            placeholder="State / Province"
            error={(errors.additionalState as any)?.message}
            inputClassName={figmaInputClassName}
          />
          <TextField
            name="additionalZip"
            label="ZIP / Postal Code"
            register={register}
            placeholder="ZIP / Postal"
            error={(errors.additionalZip as any)?.message}
            inputClassName={figmaInputClassName}
          />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Service Offerings - Checkboxes */}
      <div className="space-y-3 pt-2">
         <label className={checkboxLabelStyles}>
            <input
                type="checkbox"
                id="telehealth"
                {...register('telehealth')}
                className={checkboxInputStyles}
            />
            <span className={checkboxTextStyles}>Offers telehealth</span>
        </label>
        {errors.telehealth && <p className="mt-1 text-xs text-red-600">{(errors.telehealth as any)?.message}</p>}

        <label className={checkboxLabelStyles}>
            <input
                type="checkbox"
                id="inPerson"
                {...register('inPerson')}
                className={checkboxInputStyles}
            />
            <span className={checkboxTextStyles}>Offers in-person sessions</span>
        </label>
        {errors.inPerson && <p className="mt-1 text-xs text-red-600">{(errors.inPerson as any)?.message}</p>}
      </div>

      <TextareaField
        name="locationDescription"
        register={register}
        // For label with HTML span, your TextareaField needs to support rendering ReactNode as label
        // Or, handle the label structure outside TextareaField like this:
        label={
            <>
                Location Description <span className='text-sm font-normal text-gray-500'>(optional)</span>
            </>
        }
        placeholder="E.g., Office is on the 2nd floor, suite 210. Ample parking available. Wheelchair accessible."
        rows={3}
        error={(errors.locationDescription as any)?.message}
        inputClassName={figmaInputClassName + " resize-y"}
      />
    </div>
  );
}