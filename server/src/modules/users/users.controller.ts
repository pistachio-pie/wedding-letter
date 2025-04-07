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
import { AccessTokenGuard } from 'src/guard/access-token.guard'

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: '현재 인증된 사용자 정보 조회 (쿠키 토큰)' })
    @ApiResponse({
        status: 200,
        description: '인증된 사용자 정보 반환',
        type: User,
    })
    getProfile(@Req() req) {
        // JwtAuthGuard와 JwtStrategy에 의해 검증된 사용자 정보가 req.user에 담깁니다.
        return req.user
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: '모든 사용자 조회' })
    @ApiResponse({ status: 200, description: '사용자 목록 반환', type: [User] })
    findAll(): Promise<User[]> {
        return this.usersService.findAll()
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    findOne(@Param('id') id: string): Promise<User | undefined> {
        return this.usersService.findOne(id)
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    create(@Body() user: User): Promise<User> {
        return this.usersService.create(user)
    }
}
