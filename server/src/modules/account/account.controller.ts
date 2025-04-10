import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { AccountService } from './account.service'
import { Account } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

@ApiTags('account')
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    @ApiOperation({ summary: '모든 계좌 정보 조회' })
    @ApiResponse({
        status: 200,
        description: '계좌 정보 목록 반환',
        type: [Account],
    })
    findAll(): Promise<Account[]> {
        return this.accountService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 계좌 정보 조회' })
    @ApiParam({ name: 'id', description: '계좌 정보 ID' })
    @ApiResponse({
        status: 200,
        description: '계좌 정보 반환',
        type: Account,
    })
    findOne(@Param('id') id: string): Promise<Account> {
        return this.accountService.findOne(+id)
    }

    @Get('invitation/:invitationId')
    @ApiOperation({ summary: '초대장별 계좌 정보 조회' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장별 계좌 정보 목록 반환',
        type: [Account],
    })
    findByInvitationId(
        @Param('invitationId') invitationId: string,
    ): Promise<Account[]> {
        return this.accountService.findByInvitationId(+invitationId)
    }

    @Post()
    @ApiOperation({ summary: '계좌 정보 생성' })
    @ApiResponse({
        status: 201,
        description: '계좌 정보 생성 완료',
        type: Account,
    })
    create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
        return this.accountService.create(createAccountDto)
    }

    @Put(':id')
    @ApiOperation({ summary: '계좌 정보 업데이트' })
    @ApiParam({ name: 'id', description: '계좌 정보 ID' })
    @ApiResponse({
        status: 200,
        description: '계좌 정보 업데이트 완료',
        type: Account,
    })
    update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
    ): Promise<Account> {
        return this.accountService.update(+id, updateAccountDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: '계좌 정보 삭제' })
    @ApiParam({ name: 'id', description: '계좌 정보 ID' })
    @ApiResponse({
        status: 200,
        description: '계좌 정보 삭제 완료',
    })
    remove(@Param('id') id: string): Promise<void> {
        return this.accountService.remove(+id)
    }
}
