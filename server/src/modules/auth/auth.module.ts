import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { KakaoStrategy } from './kakao.strategy'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '../token/jwt.strategy'
import { AccessTokenStrategy } from '../token/access-token.strategy'
import { TokenService } from '../token/token.service'

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_ACCESS_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN'),
                },
            }),
        }),
    ],
    providers: [
        AuthService,
        KakaoStrategy,
        JwtStrategy,
        AccessTokenStrategy,
        TokenService,
    ],
    controllers: [AuthController],
    exports: [AuthService, TokenService],
})
export class AuthModule {}
