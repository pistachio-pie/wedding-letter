import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors({
        origin: true, // 모든 출처 허용
        credentials: true, // 인증 정보(쿠키) 허용
    })

    // 쿠키 파서 미들웨어 추가
    app.use(cookieParser())

    // 요청 로깅 미들웨어 추가
    app.use((req, res, next) => {
        console.log('=== 요청 정보 ===')
        console.log('요청 URL:', req.url)
        console.log('요청 메서드:', req.method)
        console.log('쿠키:', req.cookies)
        console.log('헤더:', req.headers)
        console.log('==================')
        next()
    })

    // 글로벌 프리픽스 설정
    app.setGlobalPrefix('api')

    // 글로벌 유효성 검사 파이프 설정
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
            transform: true, // 요청 데이터를 DTO 클래스의 인스턴스로 변환
            forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 자체를 거부
            transformOptions: {
                enableImplicitConversion: true, // 암시적 타입 변환 활성화
            },
        }),
    )

    // 전역 응답 변환 인터셉터 적용
    app.useGlobalInterceptors(new TransformResponseInterceptor())

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
