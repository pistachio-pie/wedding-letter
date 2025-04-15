import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiExtraModels,
    getSchemaPath,
} from '@nestjs/swagger'
import { ApiResponseDto } from './types/api-response.dto'

@ApiTags('기본')
@Controller()
@ApiExtraModels(ApiResponseDto)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiOperation({ summary: '서버 상태 확인' })
    @ApiResponse({
        status: 200,
        description: '서버 상태 확인 메시지 반환',
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseDto) },
                {
                    properties: {
                        data: {
                            type: 'string',
                            example: 'Hello World!',
                        },
                    },
                },
            ],
        },
    })
    getHello(): string {
        return this.appService.getHello()
    }
}
