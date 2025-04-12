import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const tempUser = [
  {
    id: 1,
    name: '김이름',
    email: 'kim@gmail.com',
    roll: '사용자',
  },
  {
    id: 2,
    name: '이이름',
    email: 'lee@gmail.com',
    roll: '사용자',
  },
]

// 회원 정보에 대한 수정이 필요하면 테이블 헤더에 수정 버튼을 추가하고 클릭 시 수정 페이지로 이동
// 삭제 버튼을 클릭 시 함수 작성 필요

export default function User() {
  return (
    <div className='flex flex-col justify-center m-4'>
      <h1 className='text-2xl font-bold my-4'>회원 목록</h1>
      <Table>
        <TableHeader>
          <TableRow className='font-bold'>
            <TableHead>ID</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>권한</TableHead>
            <TableHead>삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tempUser.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roll}</TableCell>
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
