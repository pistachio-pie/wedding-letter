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
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { Comment } from './entities/comment.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@ApiTags('comment')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    @ApiOperation({ summary: '모든 댓글 조회' })
    @ApiResponse({
        status: 200,
        description: '댓글 목록 반환',
        type: [Comment],
    })
    findAll(): Promise<Comment[]> {
        return this.commentService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 댓글 조회' })
    @ApiParam({ name: 'id', description: '댓글 ID' })
    @ApiResponse({
        status: 200,
        description: '댓글 정보 반환',
        type: Comment,
    })
    findOne(@Param('id') id: string): Promise<Comment> {
        return this.commentService.findOne(+id)
    }

    @Get('invitation/:invitationId')
    @ApiOperation({ summary: '초대장별 댓글 조회' })
    @ApiParam({ name: 'invitationId', description: '초대장 ID' })
    @ApiResponse({
        status: 200,
        description: '초대장별 댓글 목록 반환',
        type: [Comment],
    })
    findByInvitationId(
        @Param('invitationId') invitationId: string,
    ): Promise<Comment[]> {
        return this.commentService.findByInvitationId(+invitationId)
    }

    @Post()
    @ApiOperation({ summary: '댓글 생성' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({
        status: 201,
        description: '댓글 생성 완료',
        type: Comment,
    })
    create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
        return this.commentService.create(createCommentDto)
    }

    @Put(':id')
    @ApiOperation({ summary: '댓글 업데이트' })
    @ApiParam({ name: 'id', description: '댓글 ID' })
    @ApiBody({ type: UpdateCommentDto })
    @ApiResponse({
        status: 200,
        description: '댓글 업데이트 완료',
        type: Comment,
    })
    update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<Comment> {
        return this.commentService.update(+id, updateCommentDto)
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
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 비밀번호 또는 찾을 수 없는 댓글',
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
