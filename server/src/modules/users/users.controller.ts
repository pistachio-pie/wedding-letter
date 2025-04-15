import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './entity/users.entity'
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiExtraModels,
    getSchemaPath,
} from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard/access-token.guard'
import { Roles } from 'src/guard/roles.decorator'
import { RolesGuard } from 'src/guard/roles.guard'
import { ApiResponseDto } from 'src/types/api-response.dto'
import { ConfigService } from '@nestjs/config'

@ApiTags('users')
@Controller('users')
@ApiExtraModels(ApiResponseDto, User)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService,
    ) {}

    @Get('profile')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('USER', 'ADMIN')
    @ApiOperation({ summary: '현재 인증된 사용자 정보 조회 (쿠키 토큰)' })
    @ApiResponse({
        status: 200,
        description: '인증된 사용자 정보 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(User) },
                    },
                },
            ],
        },
    })
    getProfile(@Req() req) {
        // JwtAuthGuard와 JwtStrategy에 의해 검증된 사용자 정보가 req.user에 담깁니다.
        return req.user
    }

    @Get()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: '관리자 전용: 모든 사용자 조회' })
    @ApiResponse({
        status: 200,
        description: '사용자 목록 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(User) },
                        },
                    },
                },
            ],
        },
    })
    async findAll(): Promise<any> {
        const users = await this.usersService.findAll()

        console.log('사용자 목록:', users)
        return {
            success: true,
            message: '사용자 목록을 성공적으로 조회했습니다.',
            data: users,
            timestamp: Date.now(),
        }
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: '관리자 전용: 특정 사용자 조회' })
    @ApiResponse({
        status: 200,
        description: '사용자 정보 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(User) },
                    },
                },
            ],
        },
    })
    async findOne(@Param('id') id: string): Promise<any> {
        const user = await this.usersService.findOne(id)
        return {
            success: true,
            message: '사용자 정보를 성공적으로 조회했습니다.',
            data: user,
            timestamp: Date.now(),
        }
    }
}
