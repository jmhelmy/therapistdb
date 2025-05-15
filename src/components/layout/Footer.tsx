// src/components/shared/Footer.tsx
import Link from 'next/link';
import Image from 'next/image'; // If you want to include your logo
// You can import icons from lucide-react if you want to use them for social media
// import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' }, // Optional
      { label: 'Press', href: '/press' },     // Optional
    ],
  },
  {
    title: 'For Users',
    links: [
      { label: 'Find a Therapist', href: '/therapists' },
      { label: 'How It Works', href: '/how-it-works' }, // Example page
      { label: 'Browse Specialties', href: '/specialties' }, // Example page
      { label: 'Mental Health Resources', href: '/resources' }, // Example page
    ],
  },
  {
    title: 'For Therapists',
    links: [
      { label: 'List Your Practice', href: '/for-therapists' },
      { label: 'Therapist FAQ', href: '/therapist-faq' },
      { label: 'Pricing', href: '/for-therapists#pricing' },
    ],
  },
  {
    title: 'Support & Legal',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/yourtherapistdb', icon: 'FB' /* Replace with <FacebookIcon /> */ },
  { label: 'Twitter', href: 'https://twitter.com/yourtherapistdb', icon: 'TW' /* Replace with <TwitterIcon /> */ },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/yourtherapistdb', icon: 'LI' /* Replace with <LinkedinIcon /> */ },
  // { label: 'Instagram', href: 'https://instagram.com/yourtherapistdb', icon: 'IG' /* Replace with <InstagramIcon /> */ },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-gray-700 print:hidden"> {/* Hides footer when printing */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and Description Section */}
          <div className="space-y-8 xl:col-span-1 mb-10 xl:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logotherapistdb.png" // Ensure this path is correct
                alt="TherapistDB Logo"
                width={36}
                height={36}
                className="h-9 w-auto" // Adjusted size
              />
              <span className="ml-3 text-2xl font-bold text-white">
                therapistdb
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting you with qualified mental health professionals to support your journey towards wellness.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  {/* Replace social.icon with actual Lucide icon components for better visuals */}
                  {/* Example: <Facebook size={20} /> */}
                  <span className="sr-only">{social.label}</span> {/* Keep for screen readers if using icons */}
                  {/* For now, using text placeholders if icons aren't set up */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> {/* Placeholder Icon */}
                    {/* Replace with actual SVG paths for each social icon or use Lucide */}
                    {social.label === 'Facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                    {social.label === 'Twitter' && <path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.08A4.496 4.496 0 0016.3 4c-2.45 0-4.44 1.99-4.44 4.44 0 .35.04.69.11.96-3.69-.19-6.96-1.95-9.15-4.64-.38.65-.6 1.41-.6 2.22 0 1.54.78 2.89 1.97 3.68-.72-.02-1.4-.22-2-.55v.05c0 2.14 1.52 3.93 3.54 4.34-.37.1-.76.15-1.16.15-.28 0-.56-.03-.83-.08.57 1.75 2.22 3.02 4.18 3.06-1.51 1.18-3.42 1.89-5.49 1.89-.36 0-.71-.02-1.06-.06C3.64 18.42 5.94 19.2 8.48 19.2c7.45 0 11.52-6.18 11.52-11.53l-.01-.52c.79-.57 1.47-1.28 2-2.04z" />}
                    {social.label === 'LinkedIn' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerSections.slice(0, 2).map((section) => (
                <div key={section.title} className="mb-8 md:mb-0">
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-4 space-y-3">
                    {section.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerSections.slice(2, 4).map((section) => (
                <div key={section.title} className="mb-8 md:mb-0">
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-4 space-y-3">
                    {section.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} TherapistDB. All rights reserved.
          </p>
           {/* Optional: Add a small disclaimer or a link to an important policy */}
          <p className="text-xs text-gray-500 text-center mt-2 max-w-2xl mx-auto">
            TherapistDB is an informational resource and does not provide medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </footer>
  );
}