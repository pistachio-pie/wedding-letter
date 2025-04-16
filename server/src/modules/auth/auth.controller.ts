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
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiExtraModels,
    getSchemaPath,
} from '@nestjs/swagger'
import { AdminRegisterDto } from './dto/admin-register.dto'
import { AdminLoginDto } from './dto/admin-login.dto'
import { ApiResponseDto } from 'src/types/api-response.dto'

@ApiTags('인증')
@Controller('auth')
@ApiExtraModels(ApiResponseDto)
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @Get('kakao')
    @UseGuards(AuthGuard('kakao'))
    @ApiOperation({ summary: '카카오 로그인' })
    @ApiResponse({
        status: 302,
        description: '카카오 로그인 페이지로 리다이렉션',
    })
    async kakaoLogin() {
        // 카카오 로그인 페이지로 리다이렉션됩니다.
        // 실제 로직은 가드에서 처리됩니다.
        return
    }

    @Get('kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    @ApiOperation({ summary: '카카오 로그인 콜백' })
    @ApiResponse({
        status: 302,
        description: '프론트엔드로 리다이렉션',
    })
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
    @ApiOperation({ summary: '토큰 갱신' })
    @ApiResponse({
        status: 200,
        description: '토큰 갱신 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                accessToken: { type: 'string' },
                            },
                        },
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: '토큰이 없거나 유효하지 않음',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: false },
                        message: { example: '리프레시 토큰이 없습니다.' },
                        data: { example: null },
                    },
                },
            ],
        },
    })
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
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' },
                                        email: { type: 'string' },
                                        role: {
                                            type: 'string',
                                            example: 'ADMIN',
                                        },
                                    },
                                },
                                accessToken: { type: 'string' },
                            },
                        },
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청 또는 이미 존재하는 이메일',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: false },
                        message: { example: '이미 존재하는 이메일입니다.' },
                        data: { example: null },
                    },
                },
            ],
        },
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
                data: {
                    user: {
                        id: result.user.id,
                        name: result.user.name,
                        email: result.user.email,
                        role: result.user.role,
                    },
                    accessToken: result.accessToken,
                },
                timestamp: Date.now(),
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
                data: null,
                timestamp: Date.now(),
            })
        }
    }

    @ApiOperation({ summary: '관리자 로그인' })
    @ApiResponse({
        status: 200,
        description: '관리자 로그인 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' },
                                        email: { type: 'string' },
                                        role: {
                                            type: 'string',
                                            example: 'ADMIN',
                                        },
                                    },
                                },
                                accessToken: { type: 'string' },
                            },
                        },
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: false },
                        message: {
                            example: '로그인 실패: 잘못된 이메일 또는 비밀번호',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
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
                data: {
                    user: {
                        id: result.user.id,
                        name: result.user.name,
                        email: result.user.email,
                        role: result.user.role,
                    },
                    accessToken: result.accessToken,
                },
                timestamp: Date.now(),
            })
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: '로그인 실패: ' + error.message,
                data: null,
                timestamp: Date.now(),
            })
        }
    }

    @Post('logout')
    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({
        status: 200,
        description: '로그아웃 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: true },
                        message: { example: '로그아웃 성공' },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async logout(@Res() res: Response) {
        // 쿠키 삭제
        res.clearCookie('refresh_token')
        res.clearCookie('access-token')

        return res.status(HttpStatus.OK).json({
            success: true,
            message: '로그아웃 성공',
            data: null,
            timestamp: Date.now(),
        })
    }

    @Post('kakao/logout')
    @ApiOperation({ summary: '카카오 계정 로그아웃' })
    @ApiResponse({
        status: 200,
        description: '카카오 로그아웃 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: true },
                        message: { example: '카카오 로그아웃 성공' },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async kakaoLogout(@Res() res: Response) {
        // 쿠키 삭제
        res.clearCookie('refresh_token')
        res.clearCookie('access-token')

        return res.status(HttpStatus.OK).json({
            success: true,
            message: '카카오 로그아웃 성공',
            data: null,
            timestamp: Date.now(),
        })
    }
}
