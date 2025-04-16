import { User } from 'src/modules/users/entity/users.entity'
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

@Entity()
export class Invitation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User

    @Column()
    groom_name: string

    @Column()
    groom_phone: string

    @Column()
    groom_father_name: string

    @Column()
    groom_mother_name: string

    @Column()
    bride_name: string

    @Column()
    bride_phone: string

    @Column()
    bride_father_name: string

    @Column()
    bride_mother_name: string

    @Column({ type: 'date' })
    wedding_date: Date

    @Column()
    venue_name: string

    @Column()
    venue_address: string

    @Column()
    venue_contact: string

    @Column()
    transportation_info: string

    @Column()
    invitation_url: string

    @Column({ type: 'text' })
    invitation_message: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
