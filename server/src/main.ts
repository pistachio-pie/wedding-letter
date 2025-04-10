import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors({
        origin: 'http://localhost:3001', // 프론트엔드 URL
        credentials: true, // 인증 정보(쿠키) 허용
    })

    // 쿠키 파서 미들웨어 추가
    app.use(cookieParser())

    // 글로벌 프리픽스 설정
    app.setGlobalPrefix('api')

    // 스웨거 설정
    const config = new DocumentBuilder()
        .setTitle('웨딩 초대장 API')
        .setDescription('웨딩 초대장 서비스를 위한 API 문서')
        .setVersion('1.0')
        .addTag('wedding')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'JWT 토큰 입력',
                in: 'header',
            },
            'access-token',
        )
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)

    await app.listen(3000)
}
bootstrap()
