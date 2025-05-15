// src/utils/formatting.ts
export function formatSlugForDisplay(slug: string): string {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  export function capitalize(str: string): string {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // You might also want a function to create slugs:
  export function createSlug(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')  // Remove all non-word chars
      .replace(/--+/g, '-');    // Replace multiple - with single -
  }