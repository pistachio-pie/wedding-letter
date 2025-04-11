import { Injectable } from '@nestjs/common'
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
        return this.accountRepository.find()
    }

    async findOne(id: number): Promise<Account> {
        return this.accountRepository.findOne({ where: { id } })
    }

    async findByInvitationId(invitationId: number): Promise<Account[]> {
        return this.accountRepository.find({ where: { invitationId } })
    }

    async create(account: Partial<Account>): Promise<Account> {
        const newAccount = this.accountRepository.create(account)
        return this.accountRepository.save(newAccount)
    }

    async update(id: number, account: Partial<Account>): Promise<Account> {
        await this.accountRepository.update(id, account)
        return this.accountRepository.findOne({ where: { id } })
    }

    async remove(id: number): Promise<void> {
        await this.accountRepository.delete(id)
    }

    async removeByInvitationId(invitationId: number): Promise<void> {
        await this.accountRepository.delete({ invitationId })
    }
}
