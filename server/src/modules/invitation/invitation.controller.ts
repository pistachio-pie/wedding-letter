import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    UseGuards,
    Req,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { InvitationService } from './invitation.service'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiExtraModels,
    getSchemaPath,
} from '@nestjs/swagger'
import { CreateInvitationCompleteDto } from './dto/create-invitation-complete.dto'
import { InvitationResponseCompleteDto } from './dto/invitation-response-complete.dto'
import { UpdateInvitationCompleteDto } from './dto/update-invitation-complete.dto'
import { ApiResponseDto } from 'src/types/api-response.dto'
import { InvitationListResponseDto } from './dto/invitation-list-response.dto'
import { AccessTokenGuard } from 'src/guard/access-token.guard'
import { RolesGuard } from 'src/guard/roles.guard'
import { Roles } from 'src/guard/roles.decorator'

@ApiTags('invitation')
@Controller('invitation')
@ApiExtraModels(
    ApiResponseDto,
    InvitationResponseCompleteDto,
    InvitationListResponseDto,
)
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) {}

    @Get()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({
        summary:
            '관리자 전용: 모든 초대장 목록 조회 (계좌 및 갤러리 정보 제외)',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID로 필터링(선택사항)',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        required: false,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: '초대장 목록 반환 (계좌 및 갤러리 정보 제외)',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: getSchemaPath(InvitationListResponseDto),
                            },
                        },
                    },
                },
            ],
        },
    })
    async findAll(
        @Query('userId') userId?: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ): Promise<any> {
        const invitations = await this.invitationService.findAllSimplified(
            userId ? +userId : null,
            page ? +page : 1,
            limit ? +limit : 10,
        )

        return {
            success: true,
            message: '초대장 목록을 성공적으로 조회했습니다.',
            data: invitations,
            timestamp: Date.now(),
        }
    }

    @Get('user/:userId')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: '사용자별 초대장 목록 조회 (계좌 및 갤러리 정보 제외)',
    })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        required: false,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: '사용자별 초대장 목록 반환 (계좌 및 갤러리 정보 제외)',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: getSchemaPath(InvitationListResponseDto),
                            },
                        },
                    },
                },
            ],
        },
    })
    async findByUserId(
        @Param('userId') userId: string,
        @Req() req,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ): Promise<any> {
        // 자신의 초대장만 조회하거나, 관리자만 다른 사용자의 초대장 조회 가능
        if (req.user.id !== +userId && req.user.role !== 'ADMIN') {
            throw new HttpException(
                '본인의 초대장만 조회할 수 있습니다.',
                HttpStatus.FORBIDDEN,
            )
        }

        const invitations = await this.invitationService.findByUserIdSimplified(
            +userId,
            page ? +page : 1,
            limit ? +limit : 10,
        )

        return {
            success: true,
            message: '초대장 목록을 성공적으로 조회했습니다.',
            data: invitations,
            timestamp: Date.now(),
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: '특정 초대장 상세 조회 (계좌정보, 갤러리 이미지 포함)',
    })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 상세 정보 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(InvitationResponseCompleteDto),
                        },
                    },
                },
            ],
        },
    })
    async findOne(@Param('id') id: string): Promise<any> {
        const invitation = await this.invitationService.findOneComplete(+id)

        return {
            success: true,
            message: '초대장을 성공적으로 조회했습니다.',
            data: invitation,
            timestamp: Date.now(),
        }
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: '초대장 생성 (계좌정보, 갤러리 이미지 포함)',
        description:
            '사용자당 하나의 초대장만 생성할 수 있습니다. 이미 초대장이 있는 경우 400 에러가 반환됩니다.',
    })
    @ApiResponse({
        status: 201,
        description: '초대장 생성 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(InvitationResponseCompleteDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: '이미 초대장이 있는 경우',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: false },
                        message: {
                            example:
                                '사용자당 하나의 초대장만 생성할 수 있습니다.',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async create(
        @Body() createInvitationDto: CreateInvitationCompleteDto,
        @Req() req,
    ): Promise<any> {
        // 본인의 초대장만 생성 가능하거나, 관리자는 모든 사용자의 초대장 생성 가능
        if (
            req.user.id !== createInvitationDto.invitation.userId &&
            req.user.role !== 'ADMIN'
        ) {
            throw new HttpException(
                '본인의 초대장만 생성할 수 있습니다.',
                HttpStatus.FORBIDDEN,
            )
        }

        const invitation =
            await this.invitationService.createComplete(createInvitationDto)

        return {
            success: true,
            message: '초대장이 성공적으로 생성되었습니다.',
            data: invitation,
            timestamp: Date.now(),
        }
    }

    @Put(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: '초대장 업데이트 (계좌정보, 갤러리 이미지 포함)' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 업데이트 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(InvitationResponseCompleteDto),
                        },
                    },
                },
            ],
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateInvitationDto: UpdateInvitationCompleteDto,
        @Req() req,
    ): Promise<any> {
        // 먼저 초대장 정보를 가져와서 사용자 ID 확인
        const invitation = await this.invitationService.findOneComplete(+id)

        // 본인의 초대장만 수정 가능하거나, 관리자는 모든 초대장 수정 가능
        if (
            req.user.id !== invitation.invitation.userId &&
            req.user.role !== 'ADMIN'
        ) {
            throw new HttpException(
                '본인의 초대장만 수정할 수 있습니다.',
                HttpStatus.FORBIDDEN,
            )
        }

        const updatedInvitation = await this.invitationService.updateComplete(
            +id,
            updateInvitationDto,
        )

        return {
            success: true,
            message: '초대장이 성공적으로 수정되었습니다.',
            data: updatedInvitation,
            timestamp: Date.now(),
        }
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: '초대장 소프트 삭제 (데이터 보존)' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 삭제 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: true },
                        message: {
                            example: '초대장이 성공적으로 삭제되었습니다.',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async remove(@Param('id') id: string, @Req() req): Promise<any> {
        // 먼저 초대장 정보를 가져와서 사용자 ID 확인
        const invitation = await this.invitationService.findOneComplete(+id)

        // 본인의 초대장만 삭제 가능하거나, 관리자는 모든 초대장 삭제 가능
        if (
            req.user.id !== invitation.invitation.userId &&
            req.user.role !== 'ADMIN'
        ) {
            throw new HttpException(
                '본인의 초대장만 삭제할 수 있습니다.',
                HttpStatus.FORBIDDEN,
            )
        }

        await this.invitationService.remove(+id)

        return {
            success: true,
            message: '초대장이 성공적으로 삭제되었습니다.',
            data: null,
            timestamp: Date.now(),
        }
    }

    @Delete(':id/hard')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({
        summary: '관리자 전용: 초대장 완전 삭제 (데이터 영구 제거)',
    })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 완전 삭제 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: true },
                        message: {
                            example: '초대장이 영구적으로 삭제되었습니다.',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async hardRemove(@Param('id') id: string): Promise<any> {
        await this.invitationService.hardRemove(+id)

        return {
            success: true,
            message: '초대장이 영구적으로 삭제되었습니다.',
            data: null,
            timestamp: Date.now(),
        }
    }

    @Put(':id/restore')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: '관리자 전용: 삭제된 초대장 복구' })
    @ApiParam({ name: 'id', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장 복구 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(InvitationResponseCompleteDto),
                        },
                    },
                },
            ],
        },
    })
    async restore(@Param('id') id: string): Promise<any> {
        const restoredInvitation = await this.invitationService.restore(+id)

        return {
            success: true,
            message: '초대장이 성공적으로 복구되었습니다.',
            data: restoredInvitation,
            timestamp: Date.now(),
        }
    }

    @Get('deleted')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({
        summary: '관리자 전용: 삭제된 초대장 목록 조회',
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        required: false,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: '삭제된 초대장 목록 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: getSchemaPath(InvitationListResponseDto),
                            },
                        },
                    },
                },
            ],
        },
    })
    async findAllDeleted(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ): Promise<any> {
        const invitations =
            await this.invitationService.findAllDeletedSimplified(
                page ? +page : 1,
                limit ? +limit : 10,
            )

        return {
            success: true,
            message: '삭제된 초대장 목록을 성공적으로 조회했습니다.',
            data: invitations,
            timestamp: Date.now(),
        }
    }
}
