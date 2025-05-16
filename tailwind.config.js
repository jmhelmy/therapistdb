// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        'brand-beige-light': '#F1E9D5',
        'brand-beige-medium': '#E2D6C0',
        'brand-card-bg': '#FFFFFF',
        'brand-accent': '#B85C38',        
        'brand-accent-hover': '#A04F30',  
        'brand-text-main': '#372C2E',      
        'brand-text-subdued': '#5A504B', 
        // If you also want to keep your teal colors available, uncomment and complete this:
        // 'teal': {
        //   '50': '#f0fdfa',
        //   '100': '#ccfbf1',
        //   '200': '#a7f3d0',
        //   '300': '#6ee7b7',
        //   '400': '#34d399',
        //   '500': '#10b981', // Your previous main teal?
        //   '600': '#059669', // Your previous hover teal?
        //   '700': '#047857',
        //   '800': '#065f46',
        //   '900': '#064e3b',
        //   '950': '#022c22',
        // },
      },
    },
  },
  plugins: [
    // No plugins are active here
  ],
}