import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm'
import { Invitation } from '../../invitation/entities/invitation.entity'

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    invitationId: number

    @ManyToOne(() => Invitation)
    @JoinColumn({ name: 'invitationId' })
    invitation: Invitation

    @Column({ type: 'enum', enum: ['신랑', '신부'] })
    owner_type: string

    @Column()
    bank_name: string

    @Column()
    account_number: string

    @Column()
    account_holder: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
