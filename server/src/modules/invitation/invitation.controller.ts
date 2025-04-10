import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { InvitationService } from './invitation.service'
import { Invitation } from './entities/invitation.entity'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { UpdateInvitationDto } from './dto/update-invitation.dto'

@ApiTags('invitation')
@Controller('invitation')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) {}

    @Get()
    @ApiOperation({ summary: '모든 초대장 조회' })
    @ApiResponse({
        status: 200,
        description: '초대장 목록 반환',
        type: [Invitation],
    })
    findAll(): Promise<Invitation[]> {
        return this.invitationService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 초대장 조회' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 정보 반환',
        type: Invitation,
    })
    findOne(@Param('id') id: string): Promise<Invitation> {
        return this.invitationService.findOne(+id)
    }

    @Get('user/:userId')
    @ApiOperation({ summary: '사용자별 초대장 조회' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({
        status: 200,
        description: '사용자별 초대장 목록 반환',
        type: [Invitation],
    })
    findByUserId(@Param('userId') userId: string): Promise<Invitation[]> {
        return this.invitationService.findByUserId(+userId)
    }

    @Post()
    @ApiOperation({ summary: '초대장 생성' })
    @ApiResponse({
        status: 201,
        description: '초대장 생성 완료',
        type: Invitation,
    })
    create(
        @Body() createInvitationDto: CreateInvitationDto,
    ): Promise<Invitation> {
        return this.invitationService.create(createInvitationDto)
    }

    @Put(':id')
    @ApiOperation({ summary: '초대장 업데이트' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 업데이트 완료',
        type: Invitation,
    })
    update(
        @Param('id') id: string,
        @Body() updateInvitationDto: UpdateInvitationDto,
    ): Promise<Invitation> {
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
