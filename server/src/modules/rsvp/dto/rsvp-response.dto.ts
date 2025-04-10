import { ApiProperty } from '@nestjs/swagger'

export class RsvpResponseDto {
    @ApiProperty({
        description: 'RSVP ID',
        example: 1,
    })
    id: number

    @ApiProperty({
        description: '초대장 ID',
        example: 1,
    })
    invitationId: number

    @ApiProperty({
        description: '참석자 이름',
        example: '김철수',
    })
    guest_name: string

    @ApiProperty({
        description: '연락처',
        example: '010-1234-5678',
    })
    contact: string

    @ApiProperty({
        description: '참석 인원 수',
        example: 2,
    })
    number_of_guest: number

    @ApiProperty({
        description: '식사 참석 여부',
        example: true,
    })
    meal_attendance: boolean

    @ApiProperty({
        description: '참석 여부',
        example: true,
    })
    attendance_status: boolean

    @ApiProperty({
        description: '생성 일시',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date

    @ApiProperty({
        description: '수정 일시',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date
}
