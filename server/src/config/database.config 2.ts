import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { registerAs } from '@nestjs/config'

export default registerAs('database', (): TypeOrmModuleOptions => {
    // 필수 환경변수 확인
    // prettier-ignore
    const requiredEnvVars = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE']
    const missingEnvVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar],
    )

    if (missingEnvVars.length > 0) {
        // prettier-ignore
        throw new Error(`다음 환경변수가 설정되지 않았습니다: ${missingEnvVars.join(', ')}`)
    }

    return {
        type: 'mariadb',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
    }
})
