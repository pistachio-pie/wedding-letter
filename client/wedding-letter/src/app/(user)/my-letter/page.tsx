import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MyLetter() {
  return (
    <div className='flex justify-center items-center min-h-dvh'>
      <Tabs defaultValue='edit' className='w-[500px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='edit'>회원정보수정</TabsTrigger>
          <TabsTrigger value='rsvp'>참석현황</TabsTrigger>
        </TabsList>

        {/* 회원정보수정탭 */}
        <TabsContent value='edit'>
          <Card>
            <CardHeader>
              <CardTitle>회원정보수정</CardTitle>
              <CardDescription>회원정보를 수정하세용가리</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='name'>이름</Label>
                <Input id='name' defaultValue='원래 유저이름' />
              </div>
              <div className='space-y-1'>
                <p>수정할 정보 뭐있지</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>수정 완료</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 참석현황탭 */}
        <TabsContent value='rsvp'>
          <Card>
            <CardHeader>
              <CardTitle>참석현황</CardTitle>
              <CardDescription>참석현황을 확인하세용가리</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                여기는 어케 보여줄지 고민해봐야함
                <br />
                참석여부 통계
              </div>
            </CardContent>
            <CardFooter>
              <Button>필요시 청첩장 수정</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
