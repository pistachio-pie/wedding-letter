import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Account } from './entities/account.entity'

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) {}

    async findAll(): Promise<Account[]> {
        return this.accountRepository.find({ withDeleted: false })
    }

    async findOne(id: number): Promise<Account> {
        return this.accountRepository.findOne({
            where: { id },
            withDeleted: false,
        })
    }

    async findByInvitationId(invitationId: number): Promise<Account[]> {
        return this.accountRepository.find({
            where: { invitationId },
            withDeleted: false,
        })
    }

    // 삭제된 계좌 포함하여 조회 (복구용)
    async findByInvitationIdWithDeleted(
        invitationId: number,
    ): Promise<Account[]> {
        return this.accountRepository.find({
            where: { invitationId },
            withDeleted: true,
        })
    }

    async create(account: Partial<Account>): Promise<Account> {
        const newAccount = this.accountRepository.create(account)
        return this.accountRepository.save(newAccount)
    }

    async update(id: number, account: Partial<Account>): Promise<Account> {
        await this.accountRepository.update(id, account)
        return this.accountRepository.findOne({ where: { id } })
    }

    // 단일 계좌 소프트 삭제
    async remove(id: number): Promise<void> {
        const account = await this.accountRepository.findOne({
            where: { id },
            withDeleted: false,
        })

        if (!account) {
            throw new NotFoundException(
                `ID가 ${id}인 계좌 정보를 찾을 수 없습니다.`,
            )
        }

        await this.accountRepository.softDelete(id)
    }

    // 초대장 ID로 연결된 모든 계좌 소프트 삭제
    async removeByInvitationId(invitationId: number): Promise<void> {
        const accounts = await this.findByInvitationId(invitationId)

        if (accounts.length > 0) {
            await this.accountRepository.softDelete({ invitationId })
        }
    }

    // 단일 계좌 완전 삭제 (관리자용)
    async hardRemove(id: number): Promise<void> {
        const account = await this.accountRepository.findOne({
            where: { id },
            withDeleted: true,
        })

        if (!account) {
            throw new NotFoundException(
                `ID가 ${id}인 계좌 정보를 찾을 수 없습니다.`,
            )
        }

        await this.accountRepository.delete(id)
    }

    // 초대장 ID로 연결된 모든 계좌 완전 삭제 (관리자용)
    async hardRemoveByInvitationId(invitationId: number): Promise<void> {
        await this.accountRepository.delete({ invitationId })
    }

    // 단일 계좌 복구
    async restore(id: number): Promise<Account> {
        const account = await this.accountRepository.findOne({
            where: { id },
            withDeleted: true,
        })

        if (!account) {
            throw new NotFoundException(
                `ID가 ${id}인 계좌 정보를 찾을 수 없습니다.`,
            )
        }

        await this.accountRepository.restore(id)
        return this.findOne(id)
    }

    // 초대장 ID로 연결된 모든 계좌 복구
    async restoreByInvitationId(invitationId: number): Promise<Account[]> {
        const accounts = await this.findByInvitationIdWithDeleted(invitationId)

        if (accounts.length > 0) {
            await this.accountRepository.restore({ invitationId })
        }

        return this.findByInvitationId(invitationId)
    }
}
