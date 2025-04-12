'use client'

import CommonFormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/hooks/auth/useUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, { message: '변경할 이름을 입력하세요' }),
})

export default function MyLetter() {
  const router = useRouter()
  const { user, isError, isLoading, refreshUserInfo, checkLoginStatus } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    // 이름 변경에 대한 처리
    // api 호출, zustand 업데이트, 페이지 렌더링
  }

  // 로딩이나 에러 상태 처리 로직 밖으로 뺄 수 있나? 확인하고 수정하기
  // 1. 로딩 상태 처리
  if (isLoading) {
    return <div className='flex justify-center items-center min-h-dvh'>로딩 중...</div>
  }

  // 2. 에러 상태 처리
  if (isError) {
    return <div className='flex justify-center items-center min-h-dvh'>에러가 발생했습니다.</div>
  }

  // 3. 비로그인 상태 처리
  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className='flex flex-col gap-4 items-center min-h-dvh w-full px-4'>
      <div className='flex justify-start gap-4 w-full'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline'>회원정보수정</Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>회원정보수정</SheetTitle>
              <SheetDescription>이름을 변경할 수 있습니다.</SheetDescription>
            </SheetHeader>

            <div className='grid gap-4 p-4'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                  <CommonFormField control={form.control} name='name' label='이름' placeholder='이름' />
                  <Button type='submit' className='w-full'>
                    변경하기
                  </Button>
                </form>
              </Form>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button variant='outline'>취소</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Button>회원탈퇴</Button>
      </div>

      <div className='flex flex-col justify-center items-center gap-4'>
        <h1>청첩장 현황 확인</h1>
        <h1>RSVP 현황 어케 보여줄지 고민중</h1>
      </div>
    </div>
  )
}
