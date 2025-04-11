import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rsvp } from './entities/rsvp.entity'

@Injectable()
export class RsvpService {
    constructor(
        @InjectRepository(Rsvp)
        private rsvpRepository: Repository<Rsvp>,
    ) {}

    async findAll(): Promise<Rsvp[]> {
        return this.rsvpRepository.find()
    }

    async findOne(id: number): Promise<Rsvp> {
        return this.rsvpRepository.findOne({ where: { id } })
    }

    async findByInvitationId(invitationId: number): Promise<Rsvp[]> {
        return this.rsvpRepository.find({ where: { invitationId } })
    }

    async create(rsvp: Partial<Rsvp>): Promise<Rsvp> {
        const newRsvp = this.rsvpRepository.create(rsvp)
        return this.rsvpRepository.save(newRsvp)
    }

    async update(id: number, rsvp: Partial<Rsvp>): Promise<Rsvp> {
        await this.rsvpRepository.update(id, rsvp)
        return this.rsvpRepository.findOne({ where: { id } })
    }

    async remove(id: number): Promise<void> {
        await this.rsvpRepository.delete(id)
    }
}
