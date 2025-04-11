import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Invitation } from './entities/invitation.entity'
import { AccountService } from '../account/account.service'
import { GalleryService } from '../gallery/gallery.service'
import { CreateInvitationCompleteDto } from './dto/create-invitation-complete.dto'
import { UpdateInvitationCompleteDto } from './dto/update-invitation-complete.dto'
import { InvitationResponseCompleteDto } from './dto/invitation-response-complete.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class InvitationService {
    constructor(
        @InjectRepository(Invitation)
        private invitationRepository: Repository<Invitation>,
        private accountService: AccountService,
        private galleryService: GalleryService,
        private dataSource: DataSource,
    ) {}

    // URL 생성을 위한 헬퍼 메서드
    private generateUniqueInvitationUrl(): string {
        const uniqueId = uuidv4().slice(0, 8)
        return `invitation/${uniqueId}`
    }

    async findAllComplete(
        userId?: number,
    ): Promise<InvitationResponseCompleteDto[]> {
        // 모든 초대장 조회
        let invitations = await this.invitationRepository.find()

        // userId가 제공된 경우 필터링
        if (userId) {
            invitations = invitations.filter((inv) => inv.userId === userId)
        }

        // 각 초대장에 대해 계좌 정보와 갤러리 이미지 조회
        const results = await Promise.all(
            invitations.map(async (invitation) => {
                // 계좌 정보 조회
                const accounts = await this.accountService.findByInvitationId(
                    invitation.id,
                )

                // 갤러리 이미지 조회
                const galleryImages =
                    await this.galleryService.findByInvitationId(invitation.id)

                // 결과 반환
                return {
                    invitation,
                    accounts,
                    galleryImages,
                }
            }),
        )

        return results
    }

    async findByUserIdComplete(
        userId: number,
    ): Promise<InvitationResponseCompleteDto[]> {
        // 사용자별 초대장 조회
        const invitations = await this.invitationRepository.find({
            where: { userId },
        })

        // 각 초대장에 대해 계좌 정보와 갤러리 이미지 조회
        const results = await Promise.all(
            invitations.map(async (invitation) => {
                // 계좌 정보 조회
                const accounts = await this.accountService.findByInvitationId(
                    invitation.id,
                )

                // 갤러리 이미지 조회
                const galleryImages =
                    await this.galleryService.findByInvitationId(invitation.id)

                // 결과 반환
                return {
                    invitation,
                    accounts,
                    galleryImages,
                }
            }),
        )

        return results
    }

    async findOneComplete(id: number): Promise<InvitationResponseCompleteDto> {
        // 1. 초대장 조회
        const invitation = await this.invitationRepository.findOne({
            where: { id },
        })

        if (!invitation) {
            throw new NotFoundException(
                `ID가 ${id}인 초대장을 찾을 수 없습니다.`,
            )
        }

        // 2. 계좌 정보 조회
        const accounts = await this.accountService.findByInvitationId(id)

        // 3. 갤러리 이미지 조회
        const galleryImages = await this.galleryService.findByInvitationId(id)

        // 4. 결과 반환
        return {
            invitation,
            accounts,
            galleryImages,
        }
    }

    async createComplete(
        createInvitationCompleteDto: CreateInvitationCompleteDto,
    ): Promise<InvitationResponseCompleteDto> {
        // 트랜잭션 시작
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // 1. 초대장 생성 (URL 자동 생성)
            const invitationData = {
                ...createInvitationCompleteDto.invitation,
                invitation_url: this.generateUniqueInvitationUrl(),
            }

            const invitation = this.invitationRepository.create(invitationData)
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

    async updateComplete(
        id: number,
        updateInvitationCompleteDto: UpdateInvitationCompleteDto,
    ): Promise<InvitationResponseCompleteDto> {
        // 트랜잭션 시작
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // 초대장 존재 여부 확인
            const invitation = await queryRunner.manager.findOne(Invitation, {
                where: { id },
            })

            if (!invitation) {
                throw new NotFoundException(
                    `ID가 ${id}인 초대장을 찾을 수 없습니다.`,
                )
            }

            // 1. 초대장 업데이트 (URL은 변경하지 않음)
            if (updateInvitationCompleteDto.invitation) {
                await queryRunner.manager.update(
                    Invitation,
                    id,
                    updateInvitationCompleteDto.invitation,
                )
            }

            const updatedInvitation = await queryRunner.manager.findOne(
                Invitation,
                { where: { id } },
            )

            const results = {
                invitation: updatedInvitation,
                accounts: [],
                galleryImages: [],
            }

            // 2. 계좌 정보 업데이트 (존재하는 경우)
            if (
                updateInvitationCompleteDto.accounts &&
                updateInvitationCompleteDto.accounts.length > 0
            ) {
                // 기존 계좌 삭제
                await this.accountService.removeByInvitationId(id)

                // 새 계좌 추가
                const accountPromises =
                    updateInvitationCompleteDto.accounts.map((account) => {
                        // 초대장 ID 설정
                        account.invitationId = id
                        return this.accountService.create(account)
                    })

                results.accounts = await Promise.all(accountPromises)
            }

            // 3. 갤러리 이미지 업데이트 (존재하는 경우)
            if (
                updateInvitationCompleteDto.galleryImages &&
                updateInvitationCompleteDto.galleryImages.length > 0
            ) {
                // 기존 이미지 삭제
                await this.galleryService.removeByInvitationId(id)

                // 새 이미지 추가
                const galleryPromises =
                    updateInvitationCompleteDto.galleryImages.map((image) => {
                        // 초대장 ID 설정
                        image.invitationId = id
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

    async remove(id: number): Promise<void> {
        const invitation = await this.invitationRepository.findOne({
            where: { id },
        })

        if (!invitation) {
            throw new NotFoundException(
                `ID가 ${id}인 초대장을 찾을 수 없습니다.`,
            )
        }

        // 연결된 계좌 정보 및 갤러리 이미지도 함께 삭제
        await this.accountService.removeByInvitationId(id)
        await this.galleryService.removeByInvitationId(id)

        // 초대장 삭제
        await this.invitationRepository.delete(id)
    }
}
