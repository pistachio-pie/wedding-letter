import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '../users/entity/users.entity'

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    /**
     * 사용자 정보로 JWT 액세스 토큰을 생성합니다.
     */
    generateAccessToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
        }

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        })
    }

    /**
     * 사용자 정보로 JWT 리프레시 토큰을 생성합니다.
     */
    generateRefreshToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
        }

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        })
    }

    /**
     * JWT 토큰을 검증합니다.
     */
    verifyToken(token: string, secret: string): any {
        try {
            return this.jwtService.verify(token, { secret })
        } catch (error) {
            throw new Error('토큰이 유효하지 않습니다')
        }
    }

    /**
     * JWT 액세스 토큰을 검증합니다.
     */
    verifyAccessToken(token: string): any {
        return this.verifyToken(
            token,
            this.configService.get<string>('JWT_ACCESS_SECRET'),
        )
    }

    /**
     * JWT 리프레시 토큰을 검증합니다.
     */
    verifyRefreshToken(token: string): any {
        return this.verifyToken(
            token,
            this.configService.get<string>('JWT_REFRESH_SECRET'),
        )
    }
}
