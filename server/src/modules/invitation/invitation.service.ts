import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Invitation } from './entities/invitation.entity'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { UpdateInvitationDto } from './dto/update-invitation.dto'
import { InvitationResponseDto } from './dto/invitation-response.dto'
import { CreateInvitationCompleteDto } from './dto/create-invitation-complete.dto'
import { AccountService } from '../account/account.service'
import { GalleryService } from '../gallery/gallery.service'

@Injectable()
export class InvitationService {
    constructor(
        @InjectRepository(Invitation)
        private invitationRepository: Repository<Invitation>,
        private accountService: AccountService,
        private galleryService: GalleryService,
        private dataSource: DataSource,
    ) {}

    async findAll(): Promise<InvitationResponseDto[]> {
        return this.invitationRepository.find()
    }

    async findOne(id: number): Promise<InvitationResponseDto> {
        return this.invitationRepository.findOne({ where: { id } })
    }

    async findByUserId(userId: number): Promise<InvitationResponseDto[]> {
        return this.invitationRepository.find({ where: { userId } })
    }

    async create(
        createInvitationDto: CreateInvitationDto,
    ): Promise<InvitationResponseDto> {
        const newInvitation =
            this.invitationRepository.create(createInvitationDto)
        return this.invitationRepository.save(newInvitation)
    }

    async update(
        id: number,
        updateInvitationDto: UpdateInvitationDto,
    ): Promise<InvitationResponseDto> {
        await this.invitationRepository.update(id, updateInvitationDto)
        return this.invitationRepository.findOne({ where: { id } })
    }

    async remove(id: number): Promise<void> {
        await this.invitationRepository.delete(id)
    }

    async createComplete(
        createInvitationCompleteDto: CreateInvitationCompleteDto,
    ) {
        // 트랜잭션 시작
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // 1. 초대장 생성
            const invitation = this.invitationRepository.create(
                createInvitationCompleteDto.invitation,
            )
            const savedInvitation = await queryRunner.manager.save(invitation)

            const results = {
                invitation: savedInvitation,
                accounts: [],
                galleryImages: [],
            }

            // 2. 계좌 정보 생성 (존재하는 경우)
            if (
                createInvitationCompleteDto.accounts &&
                createInvitationCompleteDto.accounts.length > 0
            ) {
                const accountPromises =
                    createInvitationCompleteDto.accounts.map((account) => {
                        // 초대장 ID 설정
                        account.invitationId = savedInvitation.id
                        return this.accountService.create(account)
                    })

                results.accounts = await Promise.all(accountPromises)
            }

            // 3. 갤러리 이미지 생성 (존재하는 경우)
            if (
                createInvitationCompleteDto.galleryImages &&
                createInvitationCompleteDto.galleryImages.length > 0
            ) {
                const galleryPromises =
                    createInvitationCompleteDto.galleryImages.map((image) => {
                        // 초대장 ID 설정
                        image.invitationId = savedInvitation.id
                        return this.galleryService.create(image)
                    })

                results.galleryImages = await Promise.all(galleryPromises)
            }

            // 트랜잭션 커밋
            await queryRunner.commitTransaction()

            return results
        } catch (error) {
            // 오류 발생 시 롤백
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            // 쿼리 러너 해제
            await queryRunner.release()
        }
    }
}
