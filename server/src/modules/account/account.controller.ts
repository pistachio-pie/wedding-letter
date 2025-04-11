import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger'
import { AccountService } from './account.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { AccountResponseDto } from './dto/account-response.dto'

@ApiTags('account')
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    @ApiOperation({ summary: '모든 계좌 정보 조회' })
    @ApiQuery({
        name: 'invitationId',
        description: '초대장 ID로 필터링(선택사항)',
        required: false,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: '계좌 정보 목록 반환',
        type: [AccountResponseDto],
    })
    async findAll(
        @Query('invitationId') invitationId?: string,
    ): Promise<AccountResponseDto[]> {
        if (invitationId) {
            return this.accountService.findByInvitationId(+invitationId)
        }
        return this.accountService.findAll()
    }

    @Get('invitation/:invitationId')
    @ApiOperation({ summary: '초대장별 계좌 정보 조회' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장별 계좌 정보 목록 반환',
        type: [AccountResponseDto],
    })
    findByInvitationId(
        @Param('invitationId') invitationId: string,
    ): Promise<AccountResponseDto[]> {
        return this.accountService.findByInvitationId(+invitationId)
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 계좌 정보 조회' })
    @ApiParam({ name: 'id', description: '계좌 정보 ID' })
    @ApiResponse({
        status: 200,
        description: '계좌 정보 반환',
        type: AccountResponseDto,
    })
    findOne(@Param('id') id: string): Promise<AccountResponseDto> {
        return this.accountService.findOne(+id)
    }

    @Post()
    @ApiOperation({ summary: '계좌 정보 생성' })
    @ApiResponse({
        status: 201,
        description: '계좌 정보 생성 완료',
        type: AccountResponseDto,
    })
    create(
        @Body() createAccountDto: CreateAccountDto,
    ): Promise<AccountResponseDto> {
        return this.accountService.create(createAccountDto)
    }

    @Put(':id')
    @ApiOperation({ summary: '계좌 정보 업데이트' })
    @ApiParam({ name: 'id', description: '계좌 정보 ID' })
    @ApiResponse({
        status: 200,
        description: '계좌 정보 업데이트 완료',
        type: AccountResponseDto,
    })
    update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
    ): Promise<AccountResponseDto> {
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
