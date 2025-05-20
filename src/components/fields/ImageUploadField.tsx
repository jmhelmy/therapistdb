// src/components/fields/ImageUploadField.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { UploadCloud, ImagePlus, XCircle, Loader2, Camera } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  currentImageUrl?: string | null;
  isCoverPhotoTrigger?: boolean;
  isProfilePhotoUploadArea?: boolean;
  placeholderClassName?: string;
  placeholderIcon?: React.ReactNode;
  placeholderText?: string;
  triggerClassName?: string;
  className?: string;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: any,
        callback: (error: any, result: any) => void
      ) => {
        open: () => void;
      };
    };
  }
}

export default function ImageUploadField({
  name,
  label,
  currentImageUrl,
  isCoverPhotoTrigger = false,
  isProfilePhotoUploadArea = false,
  placeholderClassName = "",
  placeholderIcon,
  placeholderText,
  triggerClassName = "",
  className = "",
}: ImageUploadFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const rhfValue = watch(name);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const formValue = watch(name);
    if (formValue) {
      setPreview(formValue);
    } else if (currentImageUrl) {
      setPreview(currentImageUrl);
    } else {
      setPreview(null);
    }
  }, [rhfValue, currentImageUrl, name, watch]);

  const openCloudinaryWidget = useCallback(() => {
    console.log(
      `ImageUploadField (${name}): Attempting to open Cloudinary widget.`
    );
    setUploadError(null);

    if (
      typeof window.cloudinary === "undefined" ||
      typeof window.cloudinary.createUploadWidget !== "function"
    ) {
      console.error(
        "ImageUploadField Error: Cloudinary widget script not loaded or 'createUploadWidget' is not available."
      );
      setUploadError(
        "Image uploader is not ready. Please ensure you are connected to the internet or try again in a moment."
      );
      setIsUploading(false);
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log(
      `ImageUploadField (${name}): Using Cloud Name: "${cloudName}", Upload Preset: "${uploadPreset}"`
    );

    if (!cloudName || !uploadPreset) {
      console.error(
        "ImageUploadField Error: Cloudinary configuration (cloudName or uploadPreset) is missing."
      );
      setUploadError(
        "Image uploader configuration error. Please contact support."
      );
      setIsUploading(false);
      return;
    }

    setIsUploading(true);

    try {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          sources: [
            "local",
            "url",
            "camera",
            "image_search",
            "google_drive",
            "dropbox",
            "instagram",
            "facebook",
          ],
          multiple: false,
          cropping: isProfilePhotoUploadArea || isCoverPhotoTrigger,
          croppingAspectRatio: isProfilePhotoUploadArea
            ? 1
            : isCoverPhotoTrigger
            ? 16 / 9
            : undefined,
          showAdvancedOptions: false,
          theme: "minimal",
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#E5E7EB",
              tabIcon: "#0D9488",
              menuIcons: "#4B5563",
              textDark: "#1F2937",
              textLight: "#F9FAFB",
              link: "#0D9488",
              action: "#0F766E",
              inactiveTabIcon: "#9CA3AF",
              error: "#EF4444",
              inProgress: "#3B82F6",
              complete: "#10B981",
              sourceBg: "#F3F4F6",
            },
            fonts: {
              default: null,
              "'Montserrat', sans-serif": {
                url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
                active: true,
              },
            },
          },
          folder: "therapist_profiles",
        },
        (error: any, result: any) => {
          setIsUploading(false);
          if (error) {
            // THIS IS THE CRITICAL LOG. EXPAND THE 'error' OBJECT IN YOUR CONSOLE.
            console.error(
              `ImageUploadField (${name}): Cloudinary Upload Error during process:`,
              error
            );
            setUploadError(
              error.message || "Image upload failed during processing."
            ); // Sets the UI message
            return;
          }
          if (result && result.event === "success") {
            console.log(
              `ImageUploadField (${name}): Upload success! Info:`,
              result.info
            );
            const secureUrl = result.info.secure_url;
            setValue(name, secureUrl, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setPreview(secureUrl);
          } else if (result && result.event === "close") {
            console.log(
              `ImageUploadField (${name}): Cloudinary widget closed by user.`
            );
          } else if (result && result.event) {
            // Log other Cloudinary events if needed for debugging
            // console.log(`ImageUploadField (${name}): Cloudinary event: ${result.event}`, result.info || '');
          }
        }
      );
      console.log(
        `ImageUploadField (${name}): Widget instance created. Calling widget.open().`
      );
      widget.open();
    } catch (e: any) {
      console.error(
        `ImageUploadField (${name}): Error creating or opening Cloudinary widget:`,
        e
      );
      setUploadError(
        "Could not initialize the image uploader. Please try again."
      );
      setIsUploading(false);
    }
  }, [name, setValue, isProfilePhotoUploadArea, isCoverPhotoTrigger]);

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    setPreview(null);
  };

  const fieldError = (errors[name] as any)?.message;

  // --- RENDER LOGIC ---
  if (isCoverPhotoTrigger) {
    return (
      <>
        <div
          style={{
            backgroundImage: `url(${preview})`,
          }}
          className={`absolute bg-cover bg-no-repeat w-full h-full rounded-lg overflow-hidden`}
        />
        <div
          className={`absolute top-3 left-3 sm:top-4 sm:left-4 ${className}`}
        >
          <button
            type="button"
            onClick={openCloudinaryWidget}
            disabled={isUploading}
            className={`inline-flex items-center text-xs font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed ${
              triggerClassName ||
              "bg-white/80 hover:bg-white text-gray-700 px-3 py-1.5 border border-gray-300"
            }`}
            aria-label={label}
          >
            <ImagePlus size={14} className="mr-1.5 shrink-0" />
            {isUploading ? "Uploading..." : label}
          </button>
          {uploadError && (
            <p className="mt-1 text-xs text-red-500">{uploadError}</p>
          )}
          {fieldError && !uploadError && (
            <p className="mt-1 text-xs text-red-500">{fieldError}</p>
          )}
        </div>
      </>
    );
  }

  if (isProfilePhotoUploadArea) {
    const basePlaceholderBoxClasses =
      "w-36 h-48 sm:w-40 sm:h-56 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative overflow-hidden group";
    const currentPlaceholderBoxStyles = preview
      ? `border-2 border-transparent hover:border-gray-300 ${placeholderClassName}`
      : `bg-slate-100 border-2 border-dashed border-gray-300 text-gray-500 hover:border-teal-400 hover:text-teal-600 ${placeholderClassName}`;

    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div
          role={!preview && !isUploading ? "button" : undefined}
          tabIndex={!preview && !isUploading ? 0 : undefined}
          onClick={!isUploading && !preview ? openCloudinaryWidget : undefined}
          onKeyDown={(e) => {
            if (
              !isUploading &&
              !preview &&
              (e.key === "Enter" || e.key === " ")
            ) {
              e.preventDefault();
              openCloudinaryWidget();
            }
          }}
          aria-label={
            !preview
              ? `Upload ${label}`
              : `${label} preview. Use buttons to change or remove.`
          }
          className={`${basePlaceholderBoxClasses} ${currentPlaceholderBoxStyles}`}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt={`${label} preview`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center space-x-2.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10">
                <button
                  title="Change Image"
                  type="button"
                  onClick={openCloudinaryWidget}
                  disabled={isUploading}
                  className="p-2.5 bg-white/90 text-gray-700 rounded-full hover:bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                  aria-label={`Change ${label}`}
                >
                  <ImagePlus size={20} />
                </button>
                <button
                  title="Remove Image"
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="p-2.5 bg-red-600/90 text-white rounded-full hover:bg-red-700 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  aria-label={`Remove ${label}`}
                >
                  <XCircle size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
                  <span className="mt-2 text-xs font-medium text-teal-600">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <Camera
                    size={44}
                    className="text-gray-400 group-hover:text-teal-500 mb-2"
                  />{" "}
                  {/* Consistent with Figma */}
                  <span className="text-sm font-medium text-gray-500 group-hover:text-teal-600">
                    {placeholderText || "Upload Photo"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Click or drag & drop
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        {uploadError && (
          <p className="mt-2 text-xs text-red-600 text-center px-2">
            {uploadError}
          </p>
        )}
        {fieldError && !uploadError && (
          <p className="mt-2 text-xs text-red-600 text-center px-2">
            {fieldError}
          </p>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className={className}>
      <button
        type="button"
        onClick={openCloudinaryWidget}
        disabled={isUploading}
        className={`px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-60 ${
          triggerClassName || "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />{" "}
            Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="inline mr-2 h-4 w-4" />{" "}
            {label || "Upload Image"}
          </>
        )}
      </button>
      {uploadError && (
        <p className="mt-1 text-xs text-red-600">{uploadError}</p>
      )}
      {fieldError && !uploadError && (
        <p className="mt-1 text-xs text-red-600">{fieldError}</p>
      )}
    </div>
  );
}
