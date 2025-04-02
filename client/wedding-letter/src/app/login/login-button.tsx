'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export function LoginButton() {
  const handleLogin = () => {
    console.log('로그인')
  }

  return (
    <Button className='w-full' onClick={handleLogin}>
      <Check /> 카카오톡 로그인
    </Button>
  )
}
