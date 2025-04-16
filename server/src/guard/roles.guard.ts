import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        console.log('RolesGuard - canActivate 시작')

        const requiredRoles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        )
        console.log('RolesGuard - 필요한 역할:', requiredRoles)

        if (!requiredRoles) {
            console.log('RolesGuard - 필요한 역할이 없음, 접근 허용')
            return true
        }

        const req = context.switchToHttp().getRequest()
        console.log('RolesGuard - 요청 객체 확인:', {
            hasUser: !!req.user,
            cookies: req.cookies,
            headers: req.headers,
        })

        // 쿠키에서 직접 토큰을 추출
        try {
            const token = req.cookies['access-token']
            if (!token) {
                console.log('RolesGuard - 토큰 없음')
                return false
            }

            // 토큰 검증
            const secret =
                process.env.JWT_ACCESS_SECRET || 'wedding_letter_2025'
            const decoded = jwt.verify(token, secret) as any
            console.log('RolesGuard - 토큰 검증됨:', decoded)

            // 역할 확인
            if (!decoded || !decoded.role) {
                console.log('RolesGuard - 토큰에 역할 정보 없음')
                return false
            }

            const userRole = decoded.role
            console.log('RolesGuard - 사용자 역할:', userRole)
            console.log('RolesGuard - 필요한 역할:', requiredRoles)

            // ADMIN 역할이 있으면 모든 접근 허용
            if (userRole === 'ADMIN') {
                console.log('RolesGuard - 관리자 권한 확인, 접근 허용')
                return true
            }

            const hasRole = requiredRoles.some((role) => userRole === role)
            console.log('RolesGuard - 역할 확인 결과:', hasRole)
            return hasRole
        } catch (error) {
            console.error('RolesGuard - 토큰 검증 오류:', error)
            return false
        }
    }
}
