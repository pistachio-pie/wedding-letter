import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

const tempLetter = {
  id: 1,
  name: '김이름',
  status: '대기',
  link: 'randomlink123',
  groom_name: '김철수',
  groom_phone: '010-1234-5678',
  groom_father_name: '김영수',
  groom_mother_name: '박영희',
  bride_name: '이영희',
  bride_phone: '010-9876-5432',
  bride_father_name: '이철수',
  bride_mother_name: '최영희',
  wedding_date: '2024-12-25',
  venue_name: '그랜드볼룸',
  venue_address: '서울시 강남구 역삼동 123-45',
  venue_contact: '02-123-4567',
  transportation_info: '지하철 2호선 강남역 3번 출구에서 도보 5분',
  invitation_url: 'https://wedding.example.com/invitation/123',
  invitation_message:
    '저희 두 사람이 사랑과 믿음으로 한 가정을 이루게 되었습니다. 바쁘시더라도 와주셔서 축복해 주시면 감사하겠습니다.',

  owner_type: '신랑',
  bank_name: '국민은행',
}

// id 값을 받아서 해당 청첩장의 상세정보를 보여주는 페이지
// 청첩장 정보 + 계죄 정보 + 사진 정보 + 코멘트 정보 + rsvp 정보
// 수정할 수 있는 정보, 수정할 수 없는 정보 구분 해서 폼 구성 필요

export default function LetterManage() {
  return (
    <div className='flex flex-col justify-center m-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>청첩장 상세정보</CardTitle>
          <CardDescription>청첩장 상세정보를 확인하고 수정할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className='w-full border-y border-gray-200 rounded-md my-4'>
            <TableBody>
              <TableRow>
                <TableCell>{tempLetter.id}</TableCell>
                <TableCell>{tempLetter.name}</TableCell>
                <TableCell>{tempLetter.status}</TableCell>
                <TableCell>{tempLetter.link}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <form>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col'>
                <div className='flex gap-4'>
                  <Label>신랑 이름</Label>
                  <span>{tempLetter.groom_name}</span>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex gap-4'>
                  <Label>신부 이름</Label>
                  <span>{tempLetter.bride_name}</span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
