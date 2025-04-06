import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-kakao'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('KAKAO_CLIENT_ID'),
            callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        // done: any,
    ) {
        const { id, username, _json } = profile
        const { kakao_account } = _json

        const user = {
            id: id,
            name: kakao_account?.profile?.nickname || username,
            email: kakao_account?.email,
            provider: 'kakao',
            kakaoAccessToken: accessToken,
            kakaoRefreshToken: refreshToken,
        }

        const result = await this.authService.validateKakaoUser(user)
        return result
    }
}
