'use client';
import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const navLinkClass = (href: string) => {
    const isActive =
      pathname === href ||
      (href === '/therapists' && pathname.startsWith('/therapists')) ||
      (href === '/blog' && pathname.startsWith('/blog')) ||
      (href === '/for-therapists' && pathname.startsWith('/for-therapists'))
    return `relative transition-all duration-300 ease-in-out text-[16px] ${
      isActive ? 'text-[#006266] font-semibold' : 'text-[#425F80] font-medium'
    } hover:text-[#006266]`
  }

  const underline = (href: string) => {
    const isActive =
      pathname === href ||
      (href === '/therapists' && pathname.startsWith('/therapists')) ||
      (href === '/blog' && pathname.startsWith('/blog')) ||
      (href === '/for-therapists' && pathname.startsWith('/for-therapists'))
    return (
      <span
        className={`absolute left-0 w-full h-[4px] bg-[#FFCD93] rounded-sm transition-all duration-300 ${
          isActive ? 'bottom-[-24px] opacity-100' : 'bottom-[-24px] opacity-0'
        }`}
      />
    )
  }

  return (
    <header className="bg-white px-6 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + Nav */}
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logotherapistdb.png" alt="therapistdb logo" width={24} height={24} />
            <span className="text-[20px] text-[#1a2d3e] font-bold">therapistdb</span>
          </Link>

          <nav className="hidden md:flex space-x-12 items-center text-sm">
            <div className="relative">
              <Link href="/about-us" className={navLinkClass('/about-us')}>
                About us
                {underline('/about-us')}
              </Link>
            </div>

            <div className="relative group">
              <Link href="/therapists" className={navLinkClass('/therapists')}>
                Find help
                {underline('/therapists')}
              </Link>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                <Link href="/browse" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Browse therapists
                </Link>
                <Link href="/search-by-zip" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Search by Zip
                </Link>
                <Link href="/concerns" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Common concerns
                </Link>
              </div>
            </div>

            <div className="relative">
              <Link href="/for-therapists" className={navLinkClass('/for-therapists')}>
                For therapists
                {underline('/for-therapists')}
              </Link>
            </div>

            <div className="relative">
              <Link href="/blog" className={navLinkClass('/blog')}>
                Blog
                {underline('/blog')}
              </Link>
            </div>
          </nav>
        </div>

        {/* Auth Links */}
        <div className="hidden md:flex items-center space-x-5">
          {status === 'loading' ? (
            <span className="text-gray-400">Loading…</span>
          ) : session ? (
            <>
              <Link
                href="/build-profile"
                className="text-[#425F80] text-[16px] font-medium hover:text-[#006266]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-[#425F80] text-[16px] font-medium hover:text-[#006266]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#425F80] text-[16px] font-medium hover:text-[#006266]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#43979c] hover:bg-[#327b7f] text-white text-[15px] font-semibold px-5 py-2.5 rounded-md"
              >
                Get listed
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#425F80]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 space-y-2 px-6">
          <Link href="/about-us" className="block text-[#425F80] hover:text-[#006266]">
            About us
          </Link>
          <Link href="/therapists" className="block text-[#425F80] hover:text-[#006266]">
            Find help
          </Link>
          <Link href="/for-therapists" className="block text-[#425F80] hover:text-[#006266]">
            For therapists
          </Link>
          <Link href="/blog" className="block text-[#425F80] hover:text-[#006266]">
            Blog
          </Link>
          {session ? (
            <>
              <Link href="/build-profile" className="block text-[#425F80] hover:text-[#006266]">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block text-[#425F80] hover:text-[#006266]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-[#425F80] hover:text-[#006266]">
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-[#43979c] hover:bg-[#327b7f] text-white px-4 py-2 rounded-md"
              >
                Get listed
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
);
}
