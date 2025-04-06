import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Req,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './entity/users.entity'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard'
import { AccessTokenGuard } from 'src/guard/access-token.guard'

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '현재 인증된 사용자 정보 조회 (Bearer 토큰)' })
    @ApiResponse({
        status: 200,
        description: '인증된 사용자 정보 반환',
        type: User,
    })
    getProfile(@Req() req) {
        // JwtAuthGuard와 JwtStrategy에 의해 검증된 사용자 정보가 req.user에 담깁니다.
        return req.user
    }

    @Get('me/cookie')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: '현재 인증된 사용자 정보 조회 (쿠키 토큰)' })
    @ApiResponse({
        status: 200,
        description: '인증된 사용자 정보 반환',
        type: User,
    })
    getProfileFromCookie(@Req() req) {
        // AccessTokenGuard와 AccessTokenStrategy에 의해 검증된 사용자 정보가 req.user에 담깁니다.
        return req.user
    }

    @Get()
    @ApiOperation({ summary: '모든 사용자 조회' })
    @ApiResponse({ status: 200, description: '사용자 목록 반환', type: [User] })
    findAll(): Promise<User[]> {
        return this.usersService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User | undefined> {
        return this.usersService.findOne(id)
    }

    @Post()
    create(@Body() user: User): Promise<User> {
        return this.usersService.create(user)
    }
}
