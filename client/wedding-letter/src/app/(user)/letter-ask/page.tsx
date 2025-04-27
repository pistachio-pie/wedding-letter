'use client'

import MultiStepForm from './multi-step-form'

// 페이지 디자인
// 해당 회원이 이미 신청하거나 청첩장을 만들었는지 확인 필요 -> api 에서 확인

export default function LetterAsk() {
  return (
    <div className='w-full px-16 flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-10'>청첩장 신청</h1>
      <MultiStepForm />
    </div>
  )
}
