import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // AuthGuard('jwt')의 canActivate 메서드를 호출
        return super.canActivate(context)
    }

    handleRequest(err, user) {
        // 에러가 있거나 사용자가 없으면 UnauthorizedException 발생
        if (err || !user) {
            throw err || new UnauthorizedException('인증에 실패했습니다')
        }
        return user
    }
}
