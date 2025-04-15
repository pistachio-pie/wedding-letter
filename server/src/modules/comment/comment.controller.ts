import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpException,
    HttpStatus,
    Query,
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiQuery,
    ApiExtraModels,
    getSchemaPath,
} from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CommentResponseDto } from './dto/comment-response.dto'
import { ApiResponseDto } from 'src/types/api-response.dto'

@ApiTags('comment')
@Controller('comment')
@ApiExtraModels(ApiResponseDto, CommentResponseDto)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    @ApiOperation({ summary: '모든 댓글 조회' })
    @ApiQuery({
        name: 'invitationId',
        description: '초대장 ID로 필터링(선택사항)',
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
        description: '댓글 목록 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        $ref: getSchemaPath(CommentResponseDto),
                                    },
                                },
                                total: { type: 'number' },
                                page: { type: 'number' },
                                lastPage: { type: 'number' },
                            },
                        },
                    },
                },
            ],
        },
    })
    async findAll(
        @Query('invitationId') invitationId?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page) : 1
        const limitNumber = limit ? parseInt(limit) : 10

        if (invitationId) {
            return this.commentService.findByInvitationId(
                +invitationId,
                pageNumber,
                limitNumber,
            )
        }
        return this.commentService.findAll(pageNumber, limitNumber)
    }

    @Get('invitation/:invitationId')
    @ApiOperation({ summary: '초대장별 댓글 조회' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
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
        description: '초대장별 댓글 목록 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        $ref: getSchemaPath(CommentResponseDto),
                                    },
                                },
                                total: { type: 'number' },
                                page: { type: 'number' },
                                lastPage: { type: 'number' },
                            },
                        },
                    },
                },
            ],
        },
    })
    findByInvitationId(
        @Param('invitationId') invitationId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page) : 1
        const limitNumber = limit ? parseInt(limit) : 10
        return this.commentService.findByInvitationId(
            +invitationId,
            pageNumber,
            limitNumber,
        )
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 댓글 조회' })
    @ApiParam({ name: 'id', description: '댓글 ID' })
    @ApiResponse({
        status: 200,
        description: '댓글 정보 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(CommentResponseDto) },
                    },
                },
            ],
        },
    })
    findOne(@Param('id') id: string): Promise<CommentResponseDto> {
        return this.commentService.findOne(+id)
    }

    @Post()
    @ApiOperation({ summary: '댓글 생성' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({
        status: 201,
        description: '댓글 생성 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(CommentResponseDto) },
                    },
                },
            ],
        },
    })
    create(
        @Body() createCommentDto: CreateCommentDto,
    ): Promise<CommentResponseDto> {
        return this.commentService.create(createCommentDto)
    }

    @Put(':id')
    @ApiOperation({ summary: '댓글 업데이트' })
    @ApiParam({ name: 'id', description: '댓글 ID' })
    @ApiBody({ type: UpdateCommentDto })
    @ApiResponse({
        status: 200,
        description: '댓글 업데이트 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(CommentResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 비밀번호 또는 찾을 수 없는 댓글',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: false },
                        message: {
                            example:
                                '잘못된 비밀번호 또는 찾을 수 없는 댓글입니다.',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<CommentResponseDto> {
        const result = await this.commentService.update(+id, updateCommentDto)
        if (!result) {
            throw new HttpException(
                '잘못된 비밀번호 또는 찾을 수 없는 댓글입니다.',
                HttpStatus.BAD_REQUEST,
            )
        }
        return result
    }

    @Delete(':id')
    @ApiOperation({ summary: '댓글 삭제' })
    @ApiParam({ name: 'id', description: '댓글 ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                password: {
                    type: 'string',
                    description: '댓글 삭제를 위한 비밀번호',
                    example: '1234',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: '댓글 삭제 완료',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: true },
                        message: {
                            example: '댓글이 성공적으로 삭제되었습니다.',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 비밀번호 또는 찾을 수 없는 댓글',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        success: { example: false },
                        message: {
                            example:
                                '잘못된 비밀번호 또는 찾을 수 없는 댓글입니다.',
                        },
                        data: { example: null },
                    },
                },
            ],
        },
    })
    async remove(
        @Param('id') id: string,
        @Body('password') password: string,
    ): Promise<void> {
        const result = await this.commentService.remove(+id, password)
        if (!result) {
            throw new HttpException(
                '잘못된 비밀번호 또는 찾을 수 없는 댓글입니다.',
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}
