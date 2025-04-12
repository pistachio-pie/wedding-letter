import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-kakao'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { v4 as uuidv4 } from 'uuid'

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

        // 이름이 없는 경우 대체 이름 생성
        let userName = kakao_account?.profile?.nickname || username

        if (!userName || userName === '미연동 계정') {
            // 임의의 한글 이름 배열
            const randomNames = [
                '하늘',
                '바다',
                '산',
                '구름',
                '별',
                '꽃',
                '나무',
                '햇살',
                '달빛',
                '바람',
            ]
            const randomName =
                randomNames[Math.floor(Math.random() * randomNames.length)]
            const shortUuid = uuidv4().substring(0, 6)
            userName = `${randomName}${shortUuid}`
        }

        const user = {
            id: id,
            name: userName,
            email: kakao_account?.email,
            provider: 'kakao',
            kakaoAccessToken: accessToken,
            kakaoRefreshToken: refreshToken,
        }

        const result = await this.authService.validateKakaoUser(user)
        return result
    }
}
