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
export class Rsvp {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    invitationId: number

    @ManyToOne(() => Invitation)
    @JoinColumn({ name: 'invitationId' })
    invitation: Invitation

    @Column()
    guest_name: string

    @Column()
    contact: string

    @Column({ type: 'int' })
    number_of_guest: number

    @Column({ type: 'boolean', default: false })
    meal_attendance: boolean

    @Column({ type: 'boolean', default: false })
    attendance_status: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
