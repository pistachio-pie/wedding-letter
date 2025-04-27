'use client'

import CommonFormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { useFormContext } from 'react-hook-form'

export default function Step3Form({ onPrev }: { onPrev: () => void }) {
  const form = useFormContext()

  return (
    <div>
      <h1>청첩장에 들어갈 사진과 글을 입력해주세요</h1>

      <CommonFormField
        control={form.control}
        type='textarea'
        label='초대장 멘트'
        placeholder='초대장 멘트'
        name='invitationMessage'
      />
      <h1>청첩장 이미지 업로드...</h1>

      <Button type='button' onClick={onPrev}>
        이전
      </Button>
      <Button type='submit'>신청하기</Button>
    </div>
  )
}
