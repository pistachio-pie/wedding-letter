'use client'

import { usePathname } from 'next/navigation'

export default function Footer() {
  // admin 페이지 여부 확인
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  // admin 페이지에서는 렌더링하지 않음
  if (isAdminPage) return null

  return (
    <footer className='bg-gray-50 flex items-center justify-center p-4'>
      <h1>Footer</h1>
    </footer>
  )
}
