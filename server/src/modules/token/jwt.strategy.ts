import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
        })
    }

    async validate(payload: any) {
        // payload에 있는 사용자 ID로 사용자 정보 조회
        const user = await this.usersService.findOne(payload.sub)
        if (!user) {
            return null
        }

        // 비밀번호와 같은 민감한 정보 제외
        delete user.password
        delete user.refreshToken

        return user
    }
}
