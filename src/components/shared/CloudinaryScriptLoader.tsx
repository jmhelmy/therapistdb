// src/components/shared/CloudinaryScriptLoader.tsx
'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

// Optional: You can use a Context or Zustand/Redux if other components
// need to react to the script loading status globally.
// For now, this component just loads it and logs.
// Child components will check `window.cloudinary` directly.

export default function CloudinaryScriptLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // This effect is just for logging and setting state, not strictly necessary
  // if child components will check window.cloudinary directly.
  useEffect(() => {
    if (window.cloudinary && window.cloudinary.createUploadWidget) {
      // This might run if the script was loaded by a previous instance of this component
      // or if another part of the app loads it.
      if (!isLoaded) {
          // console.log("CloudinaryScriptLoader: Widget already available on mount.");
          setIsLoaded(true);
      }
    }
  }, [isLoaded]); // Rerun if isLoaded changes (though it won't change back to false here)


  return (
    <Script
      id="cloudinary-upload-widget-script" // Important for a unique ID
      src="https://upload-widget.cloudinary.com/global/all.js"
      strategy="lazyOnload" // Safest strategy for external UI widgets
      onLoad={() => {
        console.log("CloudinaryScriptLoader: Cloudinary Upload Widget Script LOADED successfully.");
        setIsLoaded(true);
        setHasError(false);
        // Optional: Dispatch a custom event if other non-React parts of your app need to know
        // window.dispatchEvent(new CustomEvent('cloudinaryloaded'));
      }}
      onError={(e) => {
        console.error("CloudinaryScriptLoader: Cloudinary Upload Widget Script FAILED TO LOAD:", e);
        setIsLoaded(false); // Explicitly set to false on error
        setHasError(true);
        // Optional: Dispatch a custom event
        // window.dispatchEvent(new CustomEvent('cloudinaryerror'));
      }}
    />
  );
}