'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import Step1Form from './step1-form'
import Step2Form from './step2-form'
import Step3Form from './step3-form'

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
  transportationInfo: z.string().min(1, { message: '식장 교통 정보를 입력하세요' }),

  invitationMessage: z.string().min(10, { message: '문구를 10글자 이상 입력하세요' }),
  invitationUrl: z.string().min(6),
})

// 멀티 스텝 폼
// 해당 회원이 이미 신청하거나 청첩장을 만들었는지 확인 필요 -> api 에서 확인

export default function MultiStepForm() {
  const [step, setStep] = useState(1)
  const nextStepRef = useRef<HTMLButtonElement>(null)

  // 랜덤 url 생성 필요
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
      transportationInfo: '',
      invitationMessage: '',
      invitationUrl: '',
    },
    mode: 'onChange',
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ ...values, weddingDate: values.weddingDate.toISOString() })
  }

  const nextStep = () => {
    setStep((step) => step + 1)
  }

  const prevStep = () => {
    setStep((step) => step - 1)
  }

  useEffect(() => {
    if (nextStepRef.current) {
      nextStepRef.current.focus()
    }
  }, [step])

  return (
    <div className='w-full px-16'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          {step === 1 && <Step1Form onNext={nextStep} />}
          {step === 2 && <Step2Form onNext={nextStep} onPrev={prevStep} />}
          {step === 3 && <Step3Form onPrev={prevStep} />}
        </form>
      </FormProvider>
    </div>
  )
}
