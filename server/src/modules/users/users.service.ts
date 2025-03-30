import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from './entity/users.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.usersRepository.find()
    }

    async findOne(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } })
    }

    async create(user: User): Promise<User> {
        return this.usersRepository.save(user)
    }
}
