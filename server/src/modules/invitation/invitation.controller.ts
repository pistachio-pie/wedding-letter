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
import { InvitationService } from './invitation.service'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { UpdateInvitationDto } from './dto/update-invitation.dto'
import { InvitationResponseDto } from './dto/invitation-response.dto'
import { GetInvitationDto } from './dto/get-invitation.dto'
import { CreateInvitationCompleteDto } from './dto/create-invitation-complete.dto'
import { InvitationResponseCompleteDto } from './dto/invitation-response-complete.dto'

@ApiTags('invitation')
@Controller('invitation')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) {}

    @Get()
    @ApiOperation({ summary: '모든 초대장 조회' })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID로 필터링(선택사항)',
        required: false,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: '초대장 목록 반환',
        type: [InvitationResponseDto],
    })
    async findAll(
        @Query() query?: GetInvitationDto,
    ): Promise<InvitationResponseDto[]> {
        const invitations = await this.invitationService.findAll()
        if (query?.userId) {
            return invitations.filter(
                (invitation) => invitation.userId === +query.userId,
            )
        }
        return invitations
    }

    @Get('user/:userId')
    @ApiOperation({ summary: '사용자별 초대장 조회' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({
        status: 200,
        description: '사용자별 초대장 목록 반환',
        type: [InvitationResponseDto],
    })
    findByUserId(
        @Param('userId') userId: string,
    ): Promise<InvitationResponseDto[]> {
        return this.invitationService.findByUserId(+userId)
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 초대장 조회' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 정보 반환',
        type: InvitationResponseDto,
    })
    findOne(@Param('id') id: string): Promise<InvitationResponseDto> {
        return this.invitationService.findOne(+id)
    }

    @Post()
    @ApiOperation({ summary: '초대장 생성' })
    @ApiResponse({
        status: 201,
        description: '초대장 생성 완료',
        type: InvitationResponseDto,
    })
    create(
        @Body() createInvitationDto: CreateInvitationDto,
    ): Promise<InvitationResponseDto> {
        return this.invitationService.create(createInvitationDto)
    }

    @Post('complete')
    @ApiOperation({
        summary: '초대장 통합 생성 (계좌정보, 갤러리 이미지 포함)',
    })
    @ApiResponse({
        status: 201,
        description: '초대장 및 관련 정보 생성 완료',
        type: InvitationResponseCompleteDto,
    })
    createComplete(
        @Body() createInvitationCompleteDto: CreateInvitationCompleteDto,
    ): Promise<InvitationResponseCompleteDto> {
        return this.invitationService.createComplete(
            createInvitationCompleteDto,
        )
    }

    @Put(':id')
    @ApiOperation({ summary: '초대장 업데이트' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 업데이트 완료',
        type: InvitationResponseDto,
    })
    update(
        @Param('id') id: string,
        @Body() updateInvitationDto: UpdateInvitationDto,
    ): Promise<InvitationResponseDto> {
        return this.invitationService.update(+id, updateInvitationDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: '초대장 삭제' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 삭제 완료',
    })
    remove(@Param('id') id: string): Promise<void> {
        return this.invitationService.remove(+id)
    }
}
