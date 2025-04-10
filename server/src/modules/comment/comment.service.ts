import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment } from './entities/comment.entity'

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}

    async findAll(): Promise<Comment[]> {
        return this.commentRepository.find()
    }

    async findOne(id: number): Promise<Comment> {
        return this.commentRepository.findOne({ where: { id } })
    }

    async findByInvitationId(invitationId: number): Promise<Comment[]> {
        return this.commentRepository.find({ where: { invitationId } })
    }

    async create(comment: Partial<Comment>): Promise<Comment> {
        const newComment = this.commentRepository.create(comment)
        return this.commentRepository.save(newComment)
    }

    async update(id: number, comment: Partial<Comment>): Promise<Comment> {
        await this.commentRepository.update(id, comment)
        return this.commentRepository.findOne({ where: { id } })
    }

    async remove(id: number, password: string): Promise<boolean> {
        const comment = await this.commentRepository.findOne({ where: { id } })
        if (!comment || comment.password !== password) {
            return false
        }
        await this.commentRepository.delete(id)
        return true
    }
}
