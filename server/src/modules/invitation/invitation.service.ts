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
        page: number = 1,
        limit: number = 10,
    ): Promise<InvitationResponseCompleteDto[]> {
        // 쿼리 조건 설정
        const queryOptions: any = {
            skip: (page - 1) * limit,
            take: limit,
        }

        // userId가 제공된 경우 where 조건 추가
        if (userId) {
            queryOptions.where = { userId }
        }

        // 페이징 적용된 쿼리로 초대장 조회
        const invitations = await this.invitationRepository.find(queryOptions)

        // 결과 배열 초기화
        const results: InvitationResponseCompleteDto[] = []

        // 각 초대장에 대해 순차적으로 계좌 정보와 갤러리 이미지 조회
        for (const invitation of invitations) {
            // 계좌 정보 조회
            const accounts = await this.accountService.findByInvitationId(
                invitation.id,
            )

            // 갤러리 이미지 조회
            const galleryImages = await this.galleryService.findByInvitationId(
                invitation.id,
            )

            // 결과 추가
            results.push({
                invitation,
                accounts,
                galleryImages,
            })
        }

        return results
    }

    async findByUserIdComplete(
        userId: number,
        page: number = 1,
        limit: number = 10,
    ): Promise<InvitationResponseCompleteDto[]> {
        // 사용자별 초대장 조회 (페이징 적용)
        const invitations = await this.invitationRepository.find({
            where: { userId },
            skip: (page - 1) * limit,
            take: limit,
        })

        // 결과 배열 초기화
        const results: InvitationResponseCompleteDto[] = []

        // 각 초대장에 대해 순차적으로 계좌 정보와 갤러리 이미지 조회
        for (const invitation of invitations) {
            // 계좌 정보 조회
            const accounts = await this.accountService.findByInvitationId(
                invitation.id,
            )

            // 갤러리 이미지 조회
            const galleryImages = await this.galleryService.findByInvitationId(
                invitation.id,
            )

            // 결과 추가
            results.push({
                invitation,
                accounts,
                galleryImages,
            })
        }

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
        try {
            // 1. 먼저 초대장 생성 (URL 자동 생성)
            const invitationData = {
                ...createInvitationCompleteDto.invitation,
                invitation_url: this.generateUniqueInvitationUrl(),
            }

            const invitation = this.invitationRepository.create(invitationData)
            const savedInvitation =
                await this.invitationRepository.save(invitation)

            const results = {
                invitation: savedInvitation,
                accounts: [],
                galleryImages: [],
            }

            // 2. 계좌 정보 생성 (존재하는 경우) - 트랜잭션 밖에서 수행
            if (
                createInvitationCompleteDto.accounts &&
                createInvitationCompleteDto.accounts.length > 0
            ) {
                // Promise.all 대신 순차적으로 처리하여 DB 부하 감소
                for (const account of createInvitationCompleteDto.accounts) {
                    const newAccount = await this.accountService.create({
                        ...account,
                        invitationId: savedInvitation.id,
                    })
                    results.accounts.push(newAccount)
                }
            }

            // 3. 갤러리 이미지 생성 (존재하는 경우) - 트랜잭션 밖에서 수행
            if (
                createInvitationCompleteDto.galleryImages &&
                createInvitationCompleteDto.galleryImages.length > 0
            ) {
                // Promise.all 대신 순차적으로 처리하여 DB 부하 감소
                for (const image of createInvitationCompleteDto.galleryImages) {
                    const newImage = await this.galleryService.create({
                        ...image,
                        invitationId: savedInvitation.id,
                    })
                    results.galleryImages.push(newImage)
                }
            }

            return results
        } catch (error) {
            // 오류 처리
            console.error('초대장 생성 중 오류 발생:', error.message)
            throw error
        }
    }

    async updateComplete(
        id: number,
        updateInvitationCompleteDto: UpdateInvitationCompleteDto,
    ): Promise<InvitationResponseCompleteDto> {
        try {
            // 초대장 존재 여부 확인
            const invitation = await this.invitationRepository.findOne({
                where: { id },
            })

            if (!invitation) {
                throw new NotFoundException(
                    `ID가 ${id}인 초대장을 찾을 수 없습니다.`,
                )
            }

            // 1. 초대장 업데이트 (URL은 변경하지 않음)
            if (updateInvitationCompleteDto.invitation) {
                await this.invitationRepository.update(
                    id,
                    updateInvitationCompleteDto.invitation,
                )
            }

            const updatedInvitation = await this.invitationRepository.findOne({
                where: { id },
            })

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

                // 새 계좌 순차적으로 추가
                for (const account of updateInvitationCompleteDto.accounts) {
                    const newAccount = await this.accountService.create({
                        ...account,
                        invitationId: id,
                    })
                    results.accounts.push(newAccount)
                }
            }

            // 3. 갤러리 이미지 업데이트 (존재하는 경우)
            if (
                updateInvitationCompleteDto.galleryImages &&
                updateInvitationCompleteDto.galleryImages.length > 0
            ) {
                // 기존 이미지 삭제
                await this.galleryService.removeByInvitationId(id)

                // 새 이미지 순차적으로 추가
                for (const image of updateInvitationCompleteDto.galleryImages) {
                    const newImage = await this.galleryService.create({
                        ...image,
                        invitationId: id,
                    })
                    results.galleryImages.push(newImage)
                }
            }

            return results
        } catch (error) {
            console.error('초대장 업데이트 중 오류 발생:', error.message)
            throw error
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
