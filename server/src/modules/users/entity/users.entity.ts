import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    password: string

    @Column({ nullable: true })
    provider: string

    @Column({ nullable: true })
    providerId: string

    @Column({ nullable: true })
    refreshToken: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    // 필요에 따라 관계 추가 (예: 게시물, 댓글 등)
    // @OneToMany(() => Post, post => post.user)
    // posts: Post[];
}
