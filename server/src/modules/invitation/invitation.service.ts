import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Invitation } from './entities/invitation.entity'

@Injectable()
export class InvitationService {
    constructor(
        @InjectRepository(Invitation)
        private invitationRepository: Repository<Invitation>,
    ) {}

    async findAll(): Promise<Invitation[]> {
        return this.invitationRepository.find()
    }

    async findOne(id: number): Promise<Invitation> {
        return this.invitationRepository.findOne({ where: { id } })
    }

    async findByUserId(userId: number): Promise<Invitation[]> {
        return this.invitationRepository.find({ where: { userId } })
    }

    async create(invitation: Partial<Invitation>): Promise<Invitation> {
        const newInvitation = this.invitationRepository.create(invitation)
        return this.invitationRepository.save(newInvitation)
    }

    async update(
        id: number,
        invitation: Partial<Invitation>,
    ): Promise<Invitation> {
        await this.invitationRepository.update(id, invitation)
        return this.invitationRepository.findOne({ where: { id } })
    }

    async remove(id: number): Promise<void> {
        await this.invitationRepository.delete(id)
    }
}
