import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

/**
 * 쿠키의 access-token을 검증하는 가드
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard('access-token') {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        console.log('AccessTokenGuard - 요청 쿠키:', request.cookies)
        console.log('AccessTokenGuard - 요청 헤더:', request.headers)

        // AuthGuard('access-token')의 canActivate 메서드를 호출
        return super.canActivate(context)
    }

    handleRequest(err, user, info) {
        // 에러가 있거나 사용자가 없으면 UnauthorizedException 발생
        if (err) {
            console.log('AccessTokenGuard - 오류:', err)
            throw err
        }

        if (!user) {
            console.log('AccessTokenGuard - 사용자 없음, info:', info)
            throw new UnauthorizedException('인증에 실패했습니다')
        }

        console.log('AccessTokenGuard - 인증된 사용자:', user)
        return user
    }
}
