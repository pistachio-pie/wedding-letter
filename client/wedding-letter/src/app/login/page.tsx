import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function Login() {
  return (
    <div className='flex justify-center items-center min-h-dvh'>
      <Card className='w-96'>
        <CardHeader>
          <CardTitle>로그인 하세용</CardTitle>
          <CardDescription>소셜로그인으로 이용이 가능합니다</CardDescription>
        </CardHeader>
        <CardContent>머시기 먼가 들어갈 내용이 있다면 추가</CardContent>
        <CardFooter>
          <Button className='w-full'>
            <Link href='http://localhost:3000/api/auth/kakao' className='flex items-center justify-center gap-2'>
              <Check />
              카카오톡 로그인
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
