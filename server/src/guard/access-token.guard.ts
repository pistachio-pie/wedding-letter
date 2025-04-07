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
        // AuthGuard('access-token')의 canActivate 메서드를 호출
        return super.canActivate(context)
    }

    handleRequest(err, user) {
        // 에러가 있거나 사용자가 없으면 UnauthorizedException 발생
        if (err || !user) {
            console.log('err', err)
            throw err || new UnauthorizedException('인증에 실패했습니다')
        }
        return user
    }
}
