'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Check } from 'lucide-react'
import Link from 'next/link'

export function LoginButton() {
  return (
    <Button className='w-full'>
      <Link href='http://localhost:3000/api/auth/kakao'>카카오톡 로그인</Link>
    </Button>
  )
}
