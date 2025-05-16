// layout/HeaderLoggedOut.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ChevronDown, Search, MapPin, Smile, Users } from 'lucide-react'; // Added icons

// Data for "Find Help" dropdown - could be moved or expanded
const findHelpDropdownItems = [
  { label: 'Search by Specialty', href: '/therapists', icon: <Search size={16} className="mr-2 text-teal-600" />, description: "Find therapists by their expertise." },
  { label: 'Search by Location', href: '/therapists', icon: <MapPin size={16} className="mr-2 text-teal-600" />, description: "Enter ZIP or browse cities/states." },
  { label: 'Anxiety & Stress', href: '/therapists?issue=Anxiety', icon: <Smile size={16} className="mr-2 text-yellow-500" />, description: "Support for anxiety and stress." },
  { label: 'Depression', href: '/therapists?issue=Depression', icon: <Users size={16} className="mr-2 text-blue-500" />, description: "Help for managing depression." }, // Placeholder icon
  // Add 2-3 more popular direct links, e.g., to states or major cities
  { label: 'Therapists in California', href: '/therapists?state=california', icon: <MapPin size={16} className="mr-2 text-orange-500" />, description: "Browse California listings." },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [findHelpOpen, setFindHelpOpen] = useState(false);
  const { data: session, status } = useSession();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside (basic implementation)
  useEffect(() => {
    const handleClickOutside = () => {
      setFindHelpOpen(false);
    };
    if (findHelpOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [findHelpOpen]);


  const navLinkClass = (href: string, isDropdownTrigger = false) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return `relative flex items-center transition-colors duration-200 ease-in-out text-[15px] group
      ${isActive ? 'text-teal-600 font-semibold' : 'text-gray-600 hover:text-teal-600 font-medium'}
      ${isDropdownTrigger ? 'cursor-pointer' : ''}`;
  };

  const activeIndicatorClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return `absolute left-0 -bottom-1.5 w-full h-0.5 rounded-full transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-center
      ${isActive ? 'bg-teal-500 scale-x-100' : 'bg-teal-500'}`;
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleFindHelpDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent document click listener from immediately closing it
    setFindHelpOpen(!findHelpOpen);
  };


  const renderNavLinks = (isMobile = false) => (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={toggleFindHelpDropdown}
          onKeyDown={(e) => e.key === 'Enter' && toggleFindHelpDropdown(e as any)}
          className={navLinkClass('/therapists', true) + (isMobile ? " w-full justify-start py-2 px-3 rounded-md hover:bg-slate-100" : " py-2")}
          aria-haspopup="true"
          aria-expanded={findHelpOpen}
        >
          Find Help
          <ChevronDown
            size={18}
            className={`ml-1 transition-transform duration-200 ${findHelpOpen ? 'rotate-180' : ''}`}
          />
          {!isMobile && <span className={activeIndicatorClass('/therapists')} />}
        </button>
        {findHelpOpen && !isMobile && (
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dropdown
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50"
          >
            {findHelpDropdownItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setFindHelpOpen(false)}
                className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                {item.icon}
                <div>
                  <span className="font-medium block">{item.label}</span>
                  {item.description && <span className="text-xs text-gray-500 block">{item.description}</span>}
                </div>
              </Link>
            ))}
             <div className="px-4 py-3 border-t border-gray-100 mt-1">
                <Link href="/therapists" onClick={() => setFindHelpOpen(false)} className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline">
                    View All Search Options →
                </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile specific dropdown content if findHelpOpen */}
      {findHelpOpen && isMobile && (
        <div className="pl-6 mt-1 space-y-1 border-l border-slate-200 ml-2">
          {findHelpDropdownItems.map((item) => (
            <Link key={item.href + item.label} href={item.href} onClick={toggleMobileMenu} className="block py-1.5 px-3 text-sm rounded-md text-gray-600 hover:bg-slate-100 hover:text-teal-600">
              {item.label}
            </Link>
          ))}
          <Link href="/therapists" onClick={toggleMobileMenu} className="block py-1.5 px-3 text-sm rounded-md text-teal-600 hover:bg-slate-100 font-medium">
            All Search Options
          </Link>
        </div>
      )}

      {['For Therapists', 'Worksheets', 'Blog', 'About Us'].map(label => {
        const href = `/${label.toLowerCase().replace(/\s+/g, '-')}`;
        return (
          <div className="relative group" key={href}>
            <Link href={href} className={navLinkClass(href) + (isMobile ? " block py-2 px-3 rounded-md hover:bg-slate-100" : " py-2")}>
              {label}
              {!isMobile && <span className={activeIndicatorClass(href)} />}
            </Link>
          </div>
        );
      })}
    </>
  );

  const renderAuthLinks = (isMobile = false) => (
    status === 'loading' ? (
      <div className={`h-8 w-20 bg-gray-200 animate-pulse rounded-md ${isMobile ? 'my-2' : ''}`} /> // Skeleton loader
    ) : session ? (
      <>
        <Link href="/account" className={navLinkClass('/account') + (isMobile ? " block py-2 px-3 rounded-md hover:bg-slate-100" : "")}>Dashboard</Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={`${navLinkClass('/')} ${isMobile ? "block w-full text-left py-2 px-3 rounded-md hover:bg-slate-100" : ""}`}
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link href="/login" className={navLinkClass('/login') + (isMobile ? " block py-2 px-3 rounded-md hover:bg-slate-100" : "")}>Login</Link>
        <Link href="/register" className={`text-white font-semibold text-[15px] px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-200 ease-in-out
          ${isMobile ? 'block text-center bg-teal-500 hover:bg-teal-600 mt-2' : 'bg-teal-600 hover:bg-teal-700'}`}>
          Get Listed
        </Link>
      </>
    )
  );


  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center shrink-0">
              <Image src="/logotherapistdb.png" alt="TherapistDB Logo" width={32} height={32} priority />
              <span className="ml-2 text-xl text-gray-800 font-bold">therapistdb</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 ml-8 lg:ml-12">
              {renderNavLinks()}
            </nav>
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {renderAuthLinks()}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle main menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-25 backdrop-blur-sm"
          onClick={toggleMobileMenu} // Close on overlay click
        >
          <nav
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6 space-y-3 overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
          >
            <div className="flex justify-between items-center mb-6">
                <Link href="/" className="flex items-center shrink-0" onClick={toggleMobileMenu}>
                  <Image src="/logotherapistdb.png" alt="TherapistDB Logo" width={28} height={28}/>
                  <span className="ml-2 text-lg text-gray-800 font-bold">therapistdb</span>
                </Link>
                <button
                    type="button"
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={toggleMobileMenu}
                    aria-label="Close menu"
                >
                    <X size={24} />
                </button>
            </div>
            {renderNavLinks(true)}
            <hr className="my-4 border-slate-200" />
            {renderAuthLinks(true)}
          </nav>
        </div>
      )}
    </header>
  );
}