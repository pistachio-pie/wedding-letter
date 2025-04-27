'use client'

import CommonFormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { useFormContext } from 'react-hook-form'

export default function Step2Form({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const form = useFormContext()

  // 현재 단계 필드들의 유효성 검사
  const validateStep = async () => {
    const isValid = await form.trigger()
    if (!isValid) {
      onNext()
    }
  }

  return (
    <div>
      <h1>결혼식 정보를 입력해주세요</h1>

      <CommonFormField control={form.control} type='datetime-local' label='결혼식 날짜' name='weddingDate' />
      <CommonFormField control={form.control} type='text' label='식장 이름' placeholder='식장 이름' name='venueName' />
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
        name='transportationInfo'
      />

      <Button type='button' onClick={onPrev}>
        이전
      </Button>
      <Button type='button' onClick={validateStep}>
        다음
      </Button>
    </div>
  )
}
