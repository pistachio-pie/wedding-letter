import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('users')
export class User {
    @ApiProperty({
        example: 'google_12345678',
        description: '사용자 ID (소셜 로그인 ID)',
    })
    @PrimaryGeneratedColumn()
    id: string

    @ApiProperty({
        example: '홍길동',
        description: '사용자 이름',
    })
    @Column({ unique: true })
    email: string

    @ApiProperty({
        example: '홍길동',
        description: '사용자 이름',
    })
    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    password: string

    @ApiProperty({
        example: 'google',
        description: '소셜 로그인 제공자',
    })
    @Column({ nullable: true })
    provider: string

    @ApiProperty({
        example: '12345678',
        description: '소셜 로그인 제공자 ID',
    })
    @Column({ nullable: true })
    providerId: string

    @ApiProperty({
        description: '리프레시 토큰',
        required: false,
    })
    @Column({ nullable: true })
    refreshToken: string

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: '생성 일시',
    })
    @CreateDateColumn()
    createdAt: Date

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: '수정 일시',
    })
    @UpdateDateColumn()
    updatedAt: Date

    // 필요에 따라 관계 추가 (예: 게시물, 댓글 등)
    // @OneToMany(() => Post, post => post.user)
    // posts: Post[];
}
