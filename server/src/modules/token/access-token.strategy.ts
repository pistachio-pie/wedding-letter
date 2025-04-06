import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'
import { Request } from 'express'

/**
 * 쿠키의 access-token을 검증하는 JWT 전략
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    'access-token',
) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                // 쿠키에서 access-token 가져오기
                if (req && req.cookies) {
                    return req.cookies['access-token']
                }
                return null
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
        })
    }

    /**
     * 토큰 검증 후 사용자 정보 반환
     */
    async validate(payload: any) {
        // payload의 sub에는 사용자 ID가 들어있음
        const user = await this.usersService.findOne(payload.sub)
        if (!user) {
            return null
        }

        // 민감한 정보 제외
        delete user.password
        delete user.refreshToken

        return user
    }
}
