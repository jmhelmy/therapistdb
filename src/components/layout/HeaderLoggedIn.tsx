// src/components/layout/HeaderLoggedIn.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  // Bell, // Optional
  // MessageSquare // Optional
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ProfileSubNavigation from './ProfileSubNavigation'; // <<< IMPORT THE NEW COMPONENT

// Navigation items for the main logged-in header
const loggedInNavItems = [
  { label: 'EHR Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> }, // Renamed for clarity
  { label: 'My Public Profile', href: '/build-profile', icon: <UserCircle size={18} /> }, // This is the entry for profile editing section
  { label: 'Account Settings', href: '/account/settings', icon: <Settings size={18} /> },
];

export default function HeaderLoggedIn() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinkClass = (href: string, isSubNav?: boolean) => {
    // Adjusted active check: exact for dashboard, startsWith for others if not subNav
    // For subNav, active state will be handled within ProfileSubNavigation itself
    const isActive = !isSubNav && (pathname === href || (href !== '/dashboard' && href !== '/' && pathname.startsWith(href)));
    return `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
      ${isActive
        ? 'bg-teal-50 text-teal-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`;
  };

  const renderNavItems = (isMobile: boolean) => (
    loggedInNavItems.map(item => (
      <Link key={item.label} href={item.href} className={navLinkClass(item.href) + (isMobile ? " text-base py-3" : "")}>
        {isMobile && item.icon && <span className="mr-3">{item.icon}</span>}
        {item.label}
      </Link>
    ))
  );

  // Determine if we are in a section that should show the profile sub-navigation
  const showProfileSubNav = pathname.startsWith('/build-profile') || pathname.startsWith('/profile/');

  return (
    <> {/* Use React Fragment to return multiple elements */}
      <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and App Name/Section */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center shrink-0">
                <Image src="/logotherapistdb.png" alt="TherapistDB Logo" width={28} height={28} />
                {/* Dynamically change header title based on section */}
                <span className="ml-2 text-lg text-gray-800 font-semibold">
                  {pathname.startsWith('/dashboard') ? 'EHR Dashboard' : 
                   (pathname.startsWith('/build-profile') || pathname.startsWith('/profile/')) ? 'Profile & Marketing' : 
                   pathname.startsWith('/account') ? 'Account Settings' : 
                   'TherapistDB'}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation (for app sections) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {renderNavItems(false)}
            </nav>

            {/* Right side: User Menu, Logout */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {session?.user && (
                <div className="relative group">
                  <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 p-1 hover:bg-gray-100">
                    <span className="sr-only">Open user menu</span>
                    {session.user.image ? (
                      <Image src={session.user.image} alt="User avatar" width={32} height={32} className="rounded-full" />
                    ) : (
                      <UserCircle size={28} className="text-gray-500" />
                    )}
                    <span className="hidden lg:inline ml-2 text-gray-700 text-sm font-medium">{session.user.name?.split(' ')[0]}</span>
                  </button>
                  <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out
                                  absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <Link href="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600">Account Settings</Link>
                    <Link href="/build-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600">Edit Public Profile</Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="app-mobile-menu"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
           <div id="app-mobile-menu" className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {renderNavItems(true)}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                  {/* ... (user info in mobile menu) ... */}
                  <div className="mt-3 px-2 space-y-1">
                      <Link href="/account/settings" className={navLinkClass('/account/settings', true) + " text-base py-3"} onClick={() => setMobileMenuOpen(false)}>Account Settings</Link>
                      <Link href="/build-profile" className={navLinkClass('/build-profile', true) + " text-base py-3"} onClick={() => setMobileMenuOpen(false)}>Edit Public Profile</Link>
                      <button
                        onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false); }}
                        className={`${navLinkClass('/', true)} w-full text-left text-base py-3`}
                      >
                        <LogOut size={18} className="mr-3"/> Sign out
                      </button>
                  </div>
              </div>
           </div>
        )}
      </header>

      {/* Conditionally render the ProfileSubNavigation below the main header */}
      {showProfileSubNav && <ProfileSubNavigation />}
    </>
  );
}