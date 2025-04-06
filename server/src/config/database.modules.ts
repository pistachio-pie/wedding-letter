import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import databaseConfig from './database.config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(databaseConfig)],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return configService.get('database')
            },
        }),
    ],
})
export class DatabaseModule {}
