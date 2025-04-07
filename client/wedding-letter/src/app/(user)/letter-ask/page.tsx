'use client'

import CommonFormField from '@/components/common-form-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

const formSchema = z.object({
  groomName: z.string().min(1, { message: '신랑 이름을 한글자 이상 입력하세요' }).max(20),
  // groomPhone: z.string().min(10, { message: '알맞은 신랑 연락처를 입력하세요' }),
  // groomFatherName: z.string().min(1, { message: '신랑 아버지 이름을 한글자 이상 입력하세요' }).max(20),
  // groomMatherName: z.string().min(1, { message: '신랑 어머니 이름을 한글자 이상 입력하세요' }).max(20),
  // brideName: z.string().min(1, { message: '신부 이름을 한글자 이상 입력하세요' }).max(20),
  // bridePhone: z.string().min(10, { message: '알맞은 신부 연락처를 입력하세요' }),
  // brideFatherName: z.string().min(1, { message: '신부 아버지 이름을 한글자 이상 입력하세요' }).max(20),
  // brideMatherName: z.string().min(1, { message: '신부 어머니 이름을 한글자 이상 입력하세요' }).max(20),

  // weddingDate: z.string().datetime().min(Date.now(), { message: '오늘 이후 날짜를 입력하세요' }),
  // venueName: z.string().min(1, { message: '식장명을 한글자 이상 입력해주세요' }).max(50),
  // venueAddress: z.string().min(10, { message: '주소를 10글자 이상 입력하세요' }),
  // venueContact: z.string().min(10, { message: '알맞은 식장 연락처를 입력하세요' }),
  // venueInfo: z.string().min(1, { message: '식장 교통 정보를 입력하세요' }),

  // invitationMessage: z.string().min(10, { message: '문구를 10글자 이상 입력하세요' }),
  // invitationImage: z.string(),
})

export default function LetterAsk() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groomName: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <div className='min-h-dvh min-w-dvw p-30'>
      <h1>청첩장 신청</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <CommonFormField name='groomName' control={form.control} description='description' />
          <CommonFormField name='groomName' control={form.control} description='description' />

          <CommonFormField name='groomName' control={form.control} description='description' />

          <CommonFormField name='groomName' control={form.control} description='description' />

          <CommonFormField name='groomName' control={form.control} description='description' />
          <Input type='email' />
          {/* <FormField
            control={form.control}
            name='groomName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>신랑이름</FormLabel>
                <FormControl>
                  <Input placeholder='placeholder' {...field} />
                </FormControl>
                <FormDescription>설명</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type='submit'>신청하기</Button>
        </form>
      </Form>
    </div>
  )
}

/*
신랑 - 이름 전화번호 부모님이름
신부 - 이름 전화번호 부모님이름
결혼식 - 날짜 주소(장소이름, 장소연락처) 교통정보
초대장멘트, 사진 
*/
