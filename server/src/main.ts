import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // 글로벌 프리픽스 설정
    app.setGlobalPrefix('api')

    // 스웨거 설정
    const config = new DocumentBuilder()
        .setTitle('API 문서')
        .setDescription('API에 대한 설명')
        .setVersion('1.0')
        .addTag('API')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(3000)
}
bootstrap()
