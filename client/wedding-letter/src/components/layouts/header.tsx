'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

export default function Header() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthStore()
  // admin 페이지 여부 확인
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  // admin 페이지에서는 렌더링하지 않음
  if (isAdminPage) return null

  // 로그아웃 버튼 동작
  const handleLogout = () => {
    try {
      logout()
      router.push('/')
    } catch (error) {
      console.error('로그아웃 실패', error)
    }
  }

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b-1 border-gray-300'>
      <div className='flex justify-between items-center p-4'>
        <div className='flex items-center'>
          <h1 className='font-extrabold mr-4'>
            <Link href='/'>Wedding Letter</Link>
          </h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href='/letter-ask' legacyBehavior passHref>
                  <NavigationMenuLink>청첩장 신청</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/my-letter' legacyBehavior passHref>
                  <NavigationMenuLink>마이 페이지</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/admin' legacyBehavior passHref>
                  <NavigationMenuLink>관리자 페이지</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {isAuthenticated ? (
          <Button onClick={handleLogout}>로그아웃</Button>
        ) : (
          <Button onClick={() => router.push('/login')}>로그인</Button>
        )}
      </div>
    </header>
  )
}
