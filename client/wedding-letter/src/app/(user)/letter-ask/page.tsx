'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import CommonFormField from '@/components/common/form-field'

const formSchema = z.object({
  groomName: z.string().min(1, { message: '신랑 이름을 한글자 이상 입력하세요' }).max(20),
  groomPhone: z.string().min(10, { message: '알맞은 신랑 연락처를 입력하세요' }),
  groomFatherName: z.string().min(1, { message: '신랑 아버지 이름을 한글자 이상 입력하세요' }).max(20),
  groomMotherName: z.string().min(1, { message: '신랑 어머니 이름을 한글자 이상 입력하세요' }).max(20),
  brideName: z.string().min(1, { message: '신부 이름을 한글자 이상 입력하세요' }).max(20),
  bridePhone: z.string().min(10, { message: '알맞은 신부 연락처를 입력하세요' }),
  brideFatherName: z.string().min(1, { message: '신부 아버지 이름을 한글자 이상 입력하세요' }).max(20),
  brideMotherName: z.string().min(1, { message: '신부 어머니 이름을 한글자 이상 입력하세요' }).max(20),

  weddingDate: z.coerce.date().min(new Date(), { message: '오늘 이후 날짜를 입력하세요' }),
  venueName: z.string().min(1, { message: '식장명을 한글자 이상 입력해주세요' }).max(50),
  venueAddress: z.string().min(10, { message: '주소를 10글자 이상 입력하세요' }),
  venueContact: z.string().min(10, { message: '알맞은 식장 연락처를 입력하세요' }),
  venueInfo: z.string().min(1, { message: '식장 교통 정보를 입력하세요' }),

  invitationMessage: z.string().min(10, { message: '문구를 10글자 이상 입력하세요' }),
  invitationImage: z.string(),
})

export default function LetterAsk() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groomName: '',
      groomPhone: '',
      groomFatherName: '',
      groomMotherName: '',
      brideName: '',
      bridePhone: '',
      brideFatherName: '',
      brideMotherName: '',
      weddingDate: new Date(),
      venueName: '',
      venueAddress: '',
      venueContact: '',
      venueInfo: '',
      invitationMessage: '',
      invitationImage: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ ...values, weddingDate: values.weddingDate.toISOString() })
  }

  return (
    <div className='min-h-dvh min-w-dvw p-30'>
      <h1 className='text-2xl font-bold mb-10'>청첩장 신청</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <h1 className='text-1xl font-bold mb-6'>신랑 정보</h1>
          <CommonFormField
            control={form.control}
            type='text'
            label='신랑 이름'
            placeholder='신랑 이름'
            name='groomName'
          />
          <CommonFormField
            control={form.control}
            type='tel'
            label='신랑 전화번호'
            placeholder='신랑 전화번호'
            name='groomPhone'
          />
          <CommonFormField
            control={form.control}
            type='text'
            label='신랑 측 아버지'
            placeholder='신랑 측 아버지'
            name='groomFatherName'
          />
          <CommonFormField
            control={form.control}
            type='text'
            label='신랑 측 어머니'
            placeholder='신랑 측 어머니'
            name='groomMotherName'
          />

          <h1 className='text-1xl font-bold mb-6'>신부 정보</h1>
          <CommonFormField
            control={form.control}
            type='text'
            label='신부 이름'
            placeholder='신부 이름'
            name='brideName'
          />
          <CommonFormField
            control={form.control}
            type='tel'
            label='신부 전화번호'
            placeholder='신부 전화번호'
            name='bridePhone'
          />
          <CommonFormField
            control={form.control}
            type='text'
            label='신부 측 아버지'
            placeholder='신부 측 아버지'
            name='brideFatherName'
          />
          <CommonFormField
            control={form.control}
            type='text'
            label='신부 측 어머니'
            placeholder='신부 측 어머니'
            name='brideMotherName'
          />

          <h1 className='text-1xl font-bold mb-6'>결혼식 정보</h1>
          <CommonFormField control={form.control} type='datetime-local' label='결혼식 날짜' name='weddingDate' />
          <CommonFormField
            control={form.control}
            type='text'
            label='식장 이름'
            placeholder='식장 이름'
            name='venueName'
          />
          <CommonFormField
            control={form.control}
            type='text'
            label='식장 주소'
            placeholder='식장 주소'
            name='venueAddress'
          />
          <CommonFormField
            control={form.control}
            type='text'
            label='식장 연락처'
            placeholder='식장 연락처'
            name='venueContact'
          />
          <CommonFormField
            control={form.control}
            type='text'
            label='식장 교통정보'
            placeholder='식장 교통정보'
            name='venueInfo'
          />

          <h1 className='text-1xl font-bold mb-6'>초대장 내용</h1>
          <CommonFormField
            control={form.control}
            type='textarea'
            label='초대장 멘트'
            placeholder='초대장 멘트'
            name='invitationMessage'
          />
          <CommonFormField
            control={form.control}
            type='file'
            label='초대장 이미지'
            name='invitationImage'
            rules={{ required: false }}
          />

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
