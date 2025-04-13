import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GalleryController } from './gallery.controller'
import { GalleryService } from './gallery.service'
import { Gallery } from './entities/gallery.entity'
import { S3Module } from '../s3/s3.module'

@Module({
    imports: [TypeOrmModule.forFeature([Gallery]), S3Module],
    controllers: [GalleryController],
    providers: [GalleryService],
    exports: [GalleryService],
})
export class GalleryModule {}
