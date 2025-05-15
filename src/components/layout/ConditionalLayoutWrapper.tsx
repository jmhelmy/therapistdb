// src/components/layout/ConditionalLayoutWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Relative imports because these files are in the SAME directory (src/components/layout/)
import HeaderLoggedOut from './HeaderLoggedOut'; // This should be your main public header
import HeaderLoggedIn from './HeaderLoggedIn';   // The one you just created/filled
import MinimalHeader from './MinimalHeader';     // The one you just created/filled
import Footer from './Footer';                   // Ensure Footer.tsx is here and exports default

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const AUTH_PAGES = ['/login', '/register'];
const CUSTOM_INTERNAL_HEADER_NO_FOOTER_PATHS = ['/build-profile', '/account'];
const APP_SHELL_PATHS = ['/dashboard', '/my-listings', '/messages', '/account/settings'];

const NO_FOOTER_PATHS = [
    ...AUTH_PAGES,
    ...CUSTOM_INTERNAL_HEADER_NO_FOOTER_PATHS,
    ...APP_SHELL_PATHS
];

export default function ConditionalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';

  let SelectedHeaderComponent = null;
  const showFooter = !NO_FOOTER_PATHS.some(path => pathname.startsWith(path));

  if (isLoadingSession) {
    SelectedHeaderComponent = () => <div className="h-[80px] bg-white shadow-sm print:hidden"></div>;
  } else if (AUTH_PAGES.some(path => pathname.startsWith(path))) {
    SelectedHeaderComponent = MinimalHeader; // Using MinimalHeader for auth pages
  } else if (CUSTOM_INTERNAL_HEADER_NO_FOOTER_PATHS.some(path => pathname.startsWith(path))) {
    SelectedHeaderComponent = null;
  } else if (session && APP_SHELL_PATHS.some(path => pathname.startsWith(path))) {
    SelectedHeaderComponent = HeaderLoggedIn;
  } else if (session) { // Logged in, but on a public page
    SelectedHeaderComponent = HeaderLoggedOut; // Or HeaderLoggedIn if preferred
  } else { // Logged out, on a public page
    SelectedHeaderComponent = HeaderLoggedOut;
  }

  return (
    <>
      <ProgressBar height="3px" color="#009CA6" options={{ showSpinner: false }} shallowRouting />
      {SelectedHeaderComponent && <SelectedHeaderComponent />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}