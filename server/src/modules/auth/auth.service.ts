import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '../users/entity/users.entity'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateKakaoUser(kakaoUser: any) {
        // 디버깅용 로그 추가
        console.log('카카오 사용자 데이터:', JSON.stringify(kakaoUser, null, 2))

        // 카카오 사용자 ID로 기존 사용자 찾기
        let user = await this.usersService.findByProviderId(
            kakaoUser.id.toString(),
            'kakao',
        )

        // 사용자가 없으면 새로 생성
        if (!user) {
            console.log('새 사용자 생성:', kakaoUser.name)
            user = await this.usersService.createSocialUser({
                name: kakaoUser.name,
                email: kakaoUser.email,
                providerId: kakaoUser.id.toString(),
                provider: 'kakao',
            })
        }
        // 사용자가 있지만 이름이 없거나 '미연동계정'인 경우 이름 업데이트
        else if (!user.name || user.name === '미연동계정') {
            console.log(
                '기존 사용자 이름 업데이트:',
                user.name,
                '->',
                kakaoUser.name,
            )
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

    async generateTokens(user: User) {
        const payload = { sub: user.id, email: user.email }

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
