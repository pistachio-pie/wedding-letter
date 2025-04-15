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
    ApiExtraModels,
    getSchemaPath,
} from '@nestjs/swagger'
import { RsvpService } from './rsvp.service'
import { CreateRsvpDto } from './dto/create-rsvp.dto'
import { UpdateRsvpDto } from './dto/update-rsvp.dto'
import { RsvpResponseDto } from './dto/rsvp-response.dto'
import { ApiResponseDto } from 'src/types/api-response.dto'

@ApiTags('rsvp')
@Controller('rsvp')
@ApiExtraModels(ApiResponseDto, RsvpResponseDto)
export class RsvpController {
    constructor(private readonly rsvpService: RsvpService) {}

    @Get()
    @ApiOperation({ summary: '모든 RSVP 조회' })
    @ApiQuery({
        name: 'invitationId',
        description: '초대장 ID로 필터링(선택사항)',
        required: false,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: 'RSVP 목록 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(RsvpResponseDto) },
                        },
                    },
                },
            ],
        },
    })
    async findAll(
        @Query('invitationId') invitationId?: string,
    ): Promise<RsvpResponseDto[]> {
        if (invitationId) {
            return this.rsvpService.findByInvitationId(+invitationId)
        }
        return this.rsvpService.findAll()
    }

    @Get('invitation/:invitationId')
    @ApiOperation({ summary: '초대장별 RSVP 조회' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장별 RSVP 목록 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(RsvpResponseDto) },
                        },
                    },
                },
            ],
        },
    })
    findByInvitationId(
        @Param('invitationId') invitationId: string,
    ): Promise<RsvpResponseDto[]> {
        return this.rsvpService.findByInvitationId(+invitationId)
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 RSVP 조회' })
    @ApiParam({ name: 'id', description: 'RSVP ID' })
    @ApiResponse({
        status: 200,
        description: 'RSVP 정보 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(RsvpResponseDto) },
                    },
                },
            ],
        },
    })
    findOne(@Param('id') id: string): Promise<RsvpResponseDto> {
        return this.rsvpService.findOne(+id)
    }

    @Post()
    @ApiOperation({ summary: 'RSVP 생성' })
    @ApiResponse({
        status: 201,
        description: 'RSVP 생성 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(RsvpResponseDto) },
                    },
                },
            ],
        },
    })
    create(@Body() createRsvpDto: CreateRsvpDto): Promise<RsvpResponseDto> {
        return this.rsvpService.create(createRsvpDto)
    }

    @Put(':id')
    @ApiOperation({ summary: 'RSVP 업데이트' })
    @ApiParam({ name: 'id', description: 'RSVP ID' })
    @ApiResponse({
        status: 200,
        description: 'RSVP 업데이트 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(RsvpResponseDto) },
                    },
                },
            ],
        },
    })
    update(
        @Param('id') id: string,
        @Body() updateRsvpDto: UpdateRsvpDto,
    ): Promise<RsvpResponseDto> {
        return this.rsvpService.update(+id, updateRsvpDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'RSVP 삭제' })
    @ApiParam({ name: 'id', description: 'RSVP ID' })
    @ApiResponse({
        status: 200,
        description: 'RSVP 삭제 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: true },
                        message: {
                            example: 'RSVP가 성공적으로 삭제되었습니다.',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    remove(@Param('id') id: string): Promise<void> {
        return this.rsvpService.remove(+id)
    }
}
