import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvitationController } from './invitation.controller'
import { InvitationService } from './invitation.service'
import { Invitation } from './entities/invitation.entity'
import { AccountModule } from '../account/account.module'
import { GalleryModule } from '../gallery/gallery.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Invitation]),
        AccountModule,
        GalleryModule,
    ],
    controllers: [InvitationController],
    providers: [InvitationService],
    exports: [InvitationService],
})
export class InvitationModule {}
