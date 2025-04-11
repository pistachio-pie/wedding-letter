import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rsvp } from './entities/rsvp.entity'
import { RsvpService } from './rsvp.service'
import { RsvpController } from './rsvp.controller'

@Module({
    imports: [TypeOrmModule.forFeature([Rsvp])],
    controllers: [RsvpController],
    providers: [RsvpService],
    exports: [RsvpService],
})
export class RsvpModule {}
