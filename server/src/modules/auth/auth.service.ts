import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '../users/entity/users.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateKakaoUser(kakaoUser: any) {
        // 카카오 사용자 ID로 기존 사용자 찾기
        let user = await this.usersService.findByProviderId(
            kakaoUser.id.toString(),
            'kakao',
        )

        // 사용자가 없으면 새로 생성
        if (!user) {
            user = await this.usersService.createSocialUser({
                name: kakaoUser.name,
                email: kakaoUser.email,
                providerId: kakaoUser.id.toString(),
                provider: 'kakao',
            })
        }
        // 사용자가 있지만 이름이 없거나 '미연동계정'인 경우 이름 업데이트
        else if (!user.name || user.name === '미연동계정') {
            await this.usersService.updateUserName(user.id, kakaoUser.name)
            user.name = kakaoUser.name
        }

        // 토큰을 생성하고 refreshToken을 DB에 저장
        const tokens = await this.generateTokens(user)
        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return {
            user,
            ...tokens,
        }
    }

    async registerAdmin(adminData: {
        name: string
        email: string
        password: string
    }) {
        // 이미 존재하는 이메일인지 확인
        const existingUser = await this.usersService.findByEmail(
            adminData.email,
        )
        if (existingUser) {
            throw new Error('이미 등록된 이메일입니다.')
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(adminData.password, 10)

        // 관리자 계정 생성
        const admin = await this.usersService.createAdmin({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
        })

        // 토큰 생성
        const tokens = await this.generateTokens(admin)
        await this.updateRefreshToken(admin.id, tokens.refreshToken)

        return {
            user: admin,
            ...tokens,
        }
    }

    async validateAdmin(email: string, password: string) {
        // 이메일로 사용자 찾기
        const user = await this.usersService.findByEmail(email)

        // 사용자가 없거나 관리자가 아닌 경우
        if (!user || user.role !== 'ADMIN') {
            throw new Error('잘못된 인증 정보입니다.')
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error('잘못된 인증 정보입니다.')
        }

        // 토큰 생성
        const tokens = await this.generateTokens(user)
        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return {
            user,
            ...tokens,
        }
    }

    async generateTokens(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        })

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        })

        return {
            accessToken,
            refreshToken,
        }
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        // 리프레시 토큰을 사용자 정보에 저장
        await this.usersService.updateRefreshToken(userId, refreshToken)
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findOne(userId)
        if (!user || !user.refreshToken) {
            throw new Error('액세스 거부됨')
        }

        // 저장된 리프레시 토큰과 비교
        const refreshTokenMatches = user.refreshToken === refreshToken
        if (!refreshTokenMatches) {
            throw new Error('액세스 거부됨')
        }

        // 새 토큰 생성
        const tokens = await this.generateTokens(user)
        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return tokens
    }

    verifyToken(token: string, secret: string) {
        return this.jwtService.verify(token, { secret })
    }
}
