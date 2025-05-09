'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  const hideHeaderOn = ['/build-profile']

  if (hideHeaderOn.some(prefix => pathname.startsWith(prefix))) {
    return null
  }

  return <Header />
}
