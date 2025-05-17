// src/components/layout/ProfileSubNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, UserSquare, Eye, CalendarCog } from 'lucide-react'; // Example icons

interface NavItem {
  name: string;
  href: string;
  icon?: React.ElementType; // Optional icon component
  matcher?: (pathname: string) => boolean; // Optional custom matcher for active state
}

const profileSubNavItems: NavItem[] = [
  {
    name: 'Client Magnet AI',
    href: '/build-profile?tab=ClientMagnetAI', // Assumes ProfileWizard can handle a tab query param
    icon: Sparkles,
    // Active if on build-profile and tab is ClientMagnetAI, or if current path is a dedicated CMAI page
    matcher: (pathname) => pathname.startsWith('/build-profile') && (new URLSearchParams(window.location.search).get('tab') === 'ClientMagnetAI'),
  },
  {
    name: 'Profile Editor',
    href: '/build-profile', // Main link to the profile wizard
    icon: UserSquare,
    // Active if on build-profile and no specific tab implies it, or other CMAI/Preview/Schedule tabs are not active
    matcher: (pathname) => pathname.startsWith('/build-profile') && !new URLSearchParams(window.location.search).get('tab'),
  },
  {
    name: 'Preview Profile',
    href: '/profile/preview', // Placeholder for a new preview page
    icon: Eye,
    matcher: (pathname) => pathname.startsWith('/profile/preview'),
  },
  {
    name: 'Public Schedule', // Renamed for clarity, for public booking availability settings
    href: '/profile/public-schedule-settings', // Placeholder for new page
    icon: CalendarCog,
    matcher: (pathname) => pathname.startsWith('/profile/public-schedule-settings'),
  },
];

export default function ProfileSubNavigation() {
  const pathname = usePathname();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const currentTab = searchParams.get('tab');

  // Determine if any sub-nav item is active based on current path
  // This helps decide if the entire sub-nav bar should be visible
  const isProfileSectionActive = profileSubNavItems.some(item => 
    item.matcher ? item.matcher(pathname) : pathname.startsWith(item.href.split('?')[0])
  ) || pathname.startsWith('/build-profile') || pathname.startsWith('/profile/');


  // If not in a relevant section, don't render this sub-navigation
  // This visibility logic might be better handled by the parent component (HeaderLoggedIn or a layout)
  // For this example, we assume it's rendered when appropriate.

  return (
    <nav className="bg-white border-b border-gray-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-14 space-x-1 sm:space-x-2 md:space-x-4">
          {/* Optional: User icon on the left as in screenshot - might be redundant if already in main header */}
          {/* <div className="p-2 rounded-full bg-gray-100 text-gray-500 mr-2 sm:mr-4">
            <UserCircleIcon className="h-6 w-6" /> {}
          </div> */}
          {profileSubNavItems.map((item) => {
            const isActive = item.matcher
              ? item.matcher(pathname)
              : (pathname === item.href.split('?')[0] || (pathname.startsWith(item.href.split('?')[0]) && item.href.split('?')[0] !== '/build-profile') || (item.href === '/build-profile' && pathname.startsWith('/build-profile') && !currentTab && item.name === 'Profile Editor') || (item.href.includes(`tab=${currentTab}`) && currentTab === 'ClientMagnetAI' && item.name === 'Client Magnet AI'));


            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col sm:flex-row items-center px-2 py-2 sm:px-3 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out group whitespace-nowrap
                  ${
                    isActive
                      ? 'text-teal-600 border-b-2 border-teal-500' // Active state with bottom border
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon && <item.icon size={18} className={`mr-0 mb-1 sm:mb-0 sm:mr-2 ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'}`} />}
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}