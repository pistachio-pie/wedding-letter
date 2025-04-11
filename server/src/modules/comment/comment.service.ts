import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment } from './entities/comment.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CommentResponseDto } from './dto/comment-response.dto'

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}

    async findAll(
        page = 1,
        limit = 10,
    ): Promise<{
        data: CommentResponseDto[]
        total: number
        page: number
        lastPage: number
    }> {
        const [data, total] = await this.commentRepository.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
            order: { createdAt: 'DESC' },
        })

        const lastPage = Math.ceil(total / limit)

        return {
            data,
            total,
            page,
            lastPage,
        }
    }

    async findOne(id: number): Promise<CommentResponseDto> {
        return this.commentRepository.findOne({ where: { id } })
    }

    async findByInvitationId(
        invitationId: number,
        page = 1,
        limit = 10,
    ): Promise<{
        data: CommentResponseDto[]
        total: number
        page: number
        lastPage: number
    }> {
        const [data, total] = await this.commentRepository.findAndCount({
            where: { invitationId },
            take: limit,
            skip: (page - 1) * limit,
            order: { createdAt: 'DESC' },
        })

        const lastPage = Math.ceil(total / limit)

        return {
            data,
            total,
            page,
            lastPage,
        }
    }

    async create(
        createCommentDto: CreateCommentDto,
    ): Promise<CommentResponseDto> {
        const newComment = this.commentRepository.create(createCommentDto)
        return this.commentRepository.save(newComment)
    }

    async update(
        id: number,
        updateCommentDto: UpdateCommentDto,
    ): Promise<CommentResponseDto> {
        const comment = await this.commentRepository.findOne({ where: { id } })

        if (!comment) {
            return null
        }

        if (
            updateCommentDto.password &&
            comment.password !== updateCommentDto.password
        ) {
            return null
        }

        // 비밀번호 필드는 업데이트하지 않음
        delete updateCommentDto.password

        await this.commentRepository.update(id, updateCommentDto)
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
