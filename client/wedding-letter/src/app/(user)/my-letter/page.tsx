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
import { useStore } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, { message: '변경할 이름을 입력하세요' }),
})

export default function MyLetter() {
  const { user } = useStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.user?.name,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    // 이름 변경에 대한 처리
    // api 호출, zustand 업데이트, 페이지 렌더링
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
