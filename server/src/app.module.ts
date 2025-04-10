import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './config/database.modules'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { InvitationModule } from './modules/invitation/invitation.module'
import { CommentModule } from './modules/comment/comment.module'
import { GalleryModule } from './modules/gallery/gallery.module'
import { RsvpModule } from './modules/rsvp/rsvp.module'
import { AccountModule } from './modules/account/account.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
        }),
        DatabaseModule,
        UsersModule,
        AuthModule,
        InvitationModule,
        CommentModule,
        GalleryModule,
        RsvpModule,
        AccountModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
