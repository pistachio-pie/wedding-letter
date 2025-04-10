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
export class Gallery {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    invitationId: number

    @ManyToOne(() => Invitation)
    @JoinColumn({ name: 'invitationId' })
    invitation: Invitation

    @Column()
    image_url: string

    @Column({ type: 'text', nullable: true })
    description: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
