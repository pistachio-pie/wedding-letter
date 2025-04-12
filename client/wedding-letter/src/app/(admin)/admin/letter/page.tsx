import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

const tempLetter = [
  {
    id: 1,
    name: '김이름',
    status: '대기',
    link: 'randomlink123',
  },
  {
    id: 2,
    name: '이이름',
    status: '배포',
    link: 'randomlink456',
  },
  {
    id: 3,
    name: '박이름',
    status: '만료',
    link: 'randomlink789',
  },
]

// 삭제 버튼을 클릭 시 함수 작성 필요

export default function Letter() {
  return (
    <div className='flex flex-col justify-center m-4'>
      <h1 className='text-2xl font-bold my-4'>청첩장 목록</h1>
      <Table>
        <TableHeader>
          <TableRow className='font-bold'>
            <TableHead>청첩장 ID</TableHead>
            <TableHead>회원 이름</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>링크</TableHead>
            <TableHead>관리</TableHead>
            <TableHead>삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tempLetter.map((letter) => (
            <TableRow key={letter.id}>
              <TableCell>{letter.id}</TableCell>
              <TableCell>{letter.name}</TableCell>
              <TableCell>{letter.status}</TableCell>
              <TableCell>{letter.link}</TableCell>
              <TableCell>
                <Button asChild>
                  <Link href={`/admin/letter/${letter.id}`}>관리</Link>
                </Button>
              </TableCell>
              <TableCell>
                <Button>삭제</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
