import {
    Controller,
    Get,
    Req,
    Res,
    UseGuards,
    Post,
    Body,
    HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AdminRegisterDto } from './dto/admin-register.dto'
import { AdminLoginDto } from './dto/admin-login.dto'

@ApiTags('인증')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @Get('kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin() {
        // 카카오 로그인 페이지로 리다이렉션됩니다.
        // 실제 로직은 가드에서 처리됩니다.
        return
    }

    @Get('kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLoginCallback(@Req() req, @Res() res: Response) {
        // req.user에는 KakaoStrategy의 validate 메서드에서 반환한 값이 있습니다.
        const { accessToken, refreshToken } = req.user

        // refreshToken은 httpOnly 쿠키로 설정하고
        // (보안을 위해 JavaScript에서 접근할 수 없게 함)
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS인 경우에만 true
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (ms 단위)
        })

        // 프론트엔드에서 사용할 access-token도 쿠키로 설정
        // (프론트에서 localStorage에 저장할 수 있도록 httpOnly는 false로 설정)
        res.cookie('access-token', accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1일 (ms 단위)
        })

        // 프론트엔드로 리다이렉션할 때 accessToken을 query parameter로 전달
        // 프론트엔드의 실제 존재하는 경로로 변경
        return res.redirect(`http://localhost:3001/kakao/login/success`)
    }

    @Post('refresh')
    async refreshTokens(@Req() req, @Res() res: Response) {
        const refreshToken = req.cookies['refresh_token']

        if (!refreshToken) {
            return res
                .status(401)
                .json({ message: '리프레시 토큰이 없습니다.' })
        }

        try {
            // 토큰에서 사용자 ID 추출
            const decoded = this.authService.verifyToken(
                refreshToken,
                this.configService.get('JWT_REFRESH_SECRET'),
            )

            // 새 토큰 발급
            const tokens = await this.authService.refreshTokens(
                decoded.sub,
                refreshToken,
            )

            // 새 리프레시 토큰을 쿠키에 설정
            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            // 새 액세스 토큰도 쿠키로 설정
            res.cookie('access-token', tokens.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000,
            })

            return res.json({ accessToken: tokens.accessToken })
        } catch (error) {
            return res
                .status(401)
                .json({ message: '토큰이 유효하지 않습니다.' })
        }
    }

    @ApiOperation({ summary: '관리자 회원가입' })
    @ApiResponse({
        status: 201,
        description: '관리자 계정 생성 성공',
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청 또는 이미 존재하는 이메일',
    })
    @Post('admin/register')
    async registerAdmin(
        @Body() adminData: AdminRegisterDto,
        @Res() res: Response,
    ) {
        try {
            const result = await this.authService.registerAdmin(adminData)

            // 리프레시 토큰 쿠키 설정
            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
            })

            // 액세스 토큰 쿠키 설정
            res.cookie('access-token', result.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 1일
            })

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: '관리자 계정이 생성되었습니다.',
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    isAdmin: result.user.isAdmin,
                },
                accessToken: result.accessToken,
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
            })
        }
    }

    @ApiOperation({ summary: '관리자 로그인' })
    @ApiResponse({
        status: 200,
        description: '관리자 로그인 성공',
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @Post('admin/login')
    async loginAdmin(@Body() loginData: AdminLoginDto, @Res() res: Response) {
        try {
            const result = await this.authService.validateAdmin(
                loginData.email,
                loginData.password,
            )

            // 리프레시 토큰 쿠키 설정
            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
            })

            // 액세스 토큰 쿠키 설정
            res.cookie('access-token', result.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 1일
            })

            return res.status(HttpStatus.OK).json({
                success: true,
                message: '로그인 성공',
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    isAdmin: result.user.isAdmin,
                },
                accessToken: result.accessToken,
            })
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: '로그인 실패: ' + error.message,
            })
        }
    }
}
