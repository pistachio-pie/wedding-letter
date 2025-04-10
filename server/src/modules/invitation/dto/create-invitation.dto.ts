import { ApiProperty } from '@nestjs/swagger'

export class CreateInvitationDto {
    @ApiProperty({
        description: '사용자 ID',
        example: 1,
    })
    userId: number

    @ApiProperty({
        description: '신랑 이름',
        example: '김철수',
    })
    groom_name: string

    @ApiProperty({
        description: '신랑 전화번호',
        example: '010-1234-5678',
    })
    groom_phone: string

    @ApiProperty({
        description: '신랑 아버지 이름',
        example: '김영수',
    })
    groom_father_name: string

    @ApiProperty({
        description: '신랑 어머니 이름',
        example: '박영희',
    })
    groom_mother_name: string

    @ApiProperty({
        description: '신부 이름',
        example: '이영희',
    })
    bride_name: string

    @ApiProperty({
        description: '신부 전화번호',
        example: '010-9876-5432',
    })
    bride_phone: string

    @ApiProperty({
        description: '신부 아버지 이름',
        example: '이철수',
    })
    bride_father_name: string

    @ApiProperty({
        description: '신부 어머니 이름',
        example: '최영희',
    })
    bride_mother_name: string

    @ApiProperty({
        description: '결혼식 날짜',
        example: '2024-12-25',
        type: Date,
    })
    wedding_date: Date

    @ApiProperty({
        description: '결혼식장 이름',
        example: '그랜드볼룸',
    })
    venue_name: string

    @ApiProperty({
        description: '결혼식장 주소',
        example: '서울시 강남구 역삼동 123-45',
    })
    venue_address: string

    @ApiProperty({
        description: '결혼식장 연락처',
        example: '02-123-4567',
    })
    venue_contact: string

    @ApiProperty({
        description: '교통 정보',
        example: '지하철 2호선 강남역 3번 출구에서 도보 5분',
    })
    transportation_info: string

    @ApiProperty({
        description: '초대장 URL',
        example: 'https://wedding.example.com/invitation/123',
    })
    invitation_url: string

    @ApiProperty({
        description: '초대장 메시지',
        example:
            '저희 두 사람이 사랑과 믿음으로 한 가정을 이루게 되었습니다. 바쁘시더라도 와주셔서 축복해 주시면 감사하겠습니다.',
    })
    invitation_message: string
}
