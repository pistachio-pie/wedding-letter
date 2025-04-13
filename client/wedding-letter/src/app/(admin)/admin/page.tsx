'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import CommonFormField from '@/components/common/form-field'
import { useAuth } from '@/hooks/auth/useAuth'

const formSchema = z.object({
  email: z.string().email({ message: '이메일 형식으로 입력해주세요' }),
  password: z.string().min(8, { message: '비밀번호는 8자 이상으로 입력해주세요' }),
})

export default function Admin() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { loginAdmin } = useAuth()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginAdmin(values)
  }

  return (
    <div className='flex justify-center items-center h-1/2'>
      <Card className='w-96'>
        <CardHeader>
          <CardTitle>관리자 페이지</CardTitle>
          <CardDescription>관리자 계정으로만 로그인이 가능합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
              <CommonFormField control={form.control} type='email' label='이메일' placeholder='이메일' name='email' />
              <CommonFormField
                control={form.control}
                type='password'
                label='비밀번호'
                placeholder='비밀번호'
                name='password'
              />
              <Button className='w-full' type='submit'>
                <Check />
                로그인
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
