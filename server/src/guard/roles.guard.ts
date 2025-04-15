import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        )
        if (!requiredRoles) {
            return true
        }
        const { user } = context.switchToHttp().getRequest()

        // 사용자 정보가 없는 경우 권한 거부
        if (!user) {
            return false
        }

        // 사용자 역할이 없는 경우 권한 거부
        if (!user.role) {
            return false
        }

        return requiredRoles.some((role) => user.role === role)
    }
}
