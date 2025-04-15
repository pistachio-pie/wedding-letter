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
                console.log('AccessTokenStrategy - 요청 쿠키:', req.cookies)
                console.log('AccessTokenStrategy - 요청 헤더:', req.headers)

                if (req && req.cookies) {
                    const token = req.cookies['access-token']
                    console.log(
                        'AccessTokenStrategy - 쿠키에서 추출한 토큰:',
                        token ? '토큰 있음' : '토큰 없음',
                    )
                    return token
                }

                // 쿠키에 토큰이 없으면 Authorization 헤더에서 찾아봄
                if (req.headers && req.headers.authorization) {
                    const auth = req.headers.authorization
                    if (auth.startsWith('Bearer ')) {
                        const token = auth.split(' ')[1]
                        console.log(
                            'AccessTokenStrategy - 헤더에서 추출한 토큰:',
                            token ? '토큰 있음' : '토큰 없음',
                        )
                        return token
                    }
                }

                console.log('AccessTokenStrategy - 토큰을 찾을 수 없음')
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
        console.log('AccessTokenStrategy - 페이로드:', payload)

        // payload의 sub에는 사용자 ID가 들어있음
        const user = await this.usersService.findOne(payload.sub)
        if (!user) {
            console.log('AccessTokenStrategy - 사용자 없음')
            return null
        }

        console.log('AccessTokenStrategy - 검증된 사용자:', user)

        // 토큰에서 role 정보 사용
        const result = {
            ...user,
            // 토큰의 role 정보를 사용
            role: payload.role || user.role,
        }

        // 민감한 정보 제외
        delete result.password
        delete result.refreshToken

        console.log('AccessTokenStrategy - 반환된 사용자 정보:', result)
        return result
    }
}
