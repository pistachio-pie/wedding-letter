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
import { GetInvitationDto } from './dto/get-invitation.dto'
import { CreateInvitationCompleteDto } from './dto/create-invitation-complete.dto'
import { InvitationResponseCompleteDto } from './dto/invitation-response-complete.dto'
import { UpdateInvitationCompleteDto } from './dto/update-invitation-complete.dto'

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
        type: [InvitationResponseCompleteDto],
    })
    async findAll(
        @Query() query?: GetInvitationDto,
    ): Promise<InvitationResponseCompleteDto[]> {
        return this.invitationService.findAllComplete(
            query?.userId ? +query.userId : null,
        )
    }

    @Get('user/:userId')
    @ApiOperation({ summary: '사용자별 초대장 조회' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({
        status: 200,
        description: '사용자별 초대장 목록 반환',
        type: [InvitationResponseCompleteDto],
    })
    findByUserId(
        @Param('userId') userId: string,
    ): Promise<InvitationResponseCompleteDto[]> {
        return this.invitationService.findByUserIdComplete(+userId)
    }

    @Get(':id')
    @ApiOperation({
        summary: '특정 초대장 조회 (계좌정보, 갤러리 이미지 포함)',
    })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 정보 반환',
        type: InvitationResponseCompleteDto,
    })
    findOne(@Param('id') id: string): Promise<InvitationResponseCompleteDto> {
        return this.invitationService.findOneComplete(+id)
    }

    @Post()
    @ApiOperation({ summary: '초대장 생성 (계좌정보, 갤러리 이미지 포함)' })
    @ApiResponse({
        status: 201,
        description: '초대장 생성 완료',
        type: InvitationResponseCompleteDto,
    })
    create(
        @Body() createInvitationDto: CreateInvitationCompleteDto,
    ): Promise<InvitationResponseCompleteDto> {
        return this.invitationService.createComplete(createInvitationDto)
    }

    @Put(':id')
    @ApiOperation({ summary: '초대장 업데이트 (계좌정보, 갤러리 이미지 포함)' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 업데이트 완료',
        type: InvitationResponseCompleteDto,
    })
    update(
        @Param('id') id: string,
        @Body() updateInvitationDto: UpdateInvitationCompleteDto,
    ): Promise<InvitationResponseCompleteDto> {
        return this.invitationService.updateComplete(+id, updateInvitationDto)
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
