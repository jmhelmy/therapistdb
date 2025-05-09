/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          // Use the CSS variable injected by next/font/google
          sans: ['var(--font-montserrat)', 'sans-serif'],
        },
      },
    },
    plugins: [
      // No more addBase plugin here—global CSS will handle base styles.
    ],
  }
  