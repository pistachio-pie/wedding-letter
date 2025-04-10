import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { RsvpService } from './rsvp.service'
import { Rsvp } from './entities/rsvp.entity'
import { CreateRsvpDto } from './dto/create-rsvp.dto'
import { UpdateRsvpDto } from './dto/update-rsvp.dto'

@ApiTags('rsvp')
@Controller('rsvp')
export class RsvpController {
    constructor(private readonly rsvpService: RsvpService) {}

    @Get()
    @ApiOperation({ summary: '모든 RSVP 조회' })
    @ApiResponse({
        status: 200,
        description: 'RSVP 목록 반환',
        type: [Rsvp],
    })
    findAll(): Promise<Rsvp[]> {
        return this.rsvpService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 RSVP 조회' })
    @ApiParam({ name: 'id', description: 'RSVP ID' })
    @ApiResponse({
        status: 200,
        description: 'RSVP 정보 반환',
        type: Rsvp,
    })
    findOne(@Param('id') id: string): Promise<Rsvp> {
        return this.rsvpService.findOne(+id)
    }

    @Get('invitation/:invitationId')
    @ApiOperation({ summary: '초대장별 RSVP 조회' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장별 RSVP 목록 반환',
        type: [Rsvp],
    })
    findByInvitationId(
        @Param('invitationId') invitationId: string,
    ): Promise<Rsvp[]> {
        return this.rsvpService.findByInvitationId(+invitationId)
    }

    @Post()
    @ApiOperation({ summary: 'RSVP 생성' })
    @ApiResponse({
        status: 201,
        description: 'RSVP 생성 완료',
        type: Rsvp,
    })
    create(@Body() createRsvpDto: CreateRsvpDto): Promise<Rsvp> {
        return this.rsvpService.create(createRsvpDto)
    }

    @Put(':id')
    @ApiOperation({ summary: 'RSVP 업데이트' })
    @ApiParam({ name: 'id', description: 'RSVP ID' })
    @ApiResponse({
        status: 200,
        description: 'RSVP 업데이트 완료',
        type: Rsvp,
    })
    update(
        @Param('id') id: string,
        @Body() updateRsvpDto: UpdateRsvpDto,
    ): Promise<Rsvp> {
        return this.rsvpService.update(+id, updateRsvpDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'RSVP 삭제' })
    @ApiParam({ name: 'id', description: 'RSVP ID' })
    @ApiResponse({
        status: 200,
        description: 'RSVP 삭제 완료',
    })
    remove(@Param('id') id: string): Promise<void> {
        return this.rsvpService.remove(+id)
    }
}
