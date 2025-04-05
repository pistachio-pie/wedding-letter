import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './entity/users.entity'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

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
