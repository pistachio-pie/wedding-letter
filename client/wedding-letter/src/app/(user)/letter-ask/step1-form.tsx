'use client'

import CommonFormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { useFormContext } from 'react-hook-form'

export default function Step1Form({ onNext }: { onNext: () => void }) {
  const form = useFormContext()

  // 현재 단계 필드들의 유효성 검사
  const validateStep = async () => {
    const isValid = await form.trigger()
    console.log(isValid)
    if (!isValid) {
      onNext()
    }
  }

  return (
    <div>
      <h1>주인공들의 기본정보를 입력해주세요</h1>

      <CommonFormField control={form.control} type='text' name='groomName' label='신랑 이름' placeholder='신랑 이름' />
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
      <CommonFormField control={form.control} type='text' label='신부 이름' placeholder='신부 이름' name='brideName' />
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
      <Button type='button' onClick={validateStep}>
        다음
      </Button>
    </div>
  )
}
