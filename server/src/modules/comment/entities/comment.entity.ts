import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Invitation } from '../../invitation/entities/invitation.entity'

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    invitationId: number

    @ManyToOne(() => Invitation)
    @JoinColumn({ name: 'invitationId' })
    invitation: Invitation

    @Column()
    author_name: string

    @Column({ type: 'text' })
    message: string

    @Column()
    password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
