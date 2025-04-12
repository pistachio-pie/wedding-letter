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

    async findByProviderId(
        providerId: string,
        provider: string,
    ): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: {
                providerId,
                provider,
            },
        })
    }

    async createSocialUser(userData: {
        name?: string
        email?: string
        providerId: string
        provider: string
    }): Promise<User> {
        const newUser = this.usersRepository.create({
            name: userData.name,
            email: userData.email,
            providerId: userData.providerId,
            provider: userData.provider,
            role: 'USER',
        })

        return this.usersRepository.save(newUser)
    }

    async updateRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<void> {
        await this.usersRepository.update(userId, {
            refreshToken: refreshToken,
        })
    }

    async updateUserName(userId: string, name: string): Promise<void> {
        await this.usersRepository.update(userId, {
            name: name,
        })
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { email },
        })
    }

    async createAdmin(userData: {
        name: string
        email: string
        password: string
    }): Promise<User> {
        const newUser = this.usersRepository.create({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            isAdmin: true,
            role: 'ADMIN',
        })

        return this.usersRepository.save(newUser)
    }
}
