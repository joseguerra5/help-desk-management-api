import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'
import { EnvModule } from '../env/env.module'
import { Uploader } from '@/domain/management/application/storage/uploader'
import { PresignedUrl } from '@/domain/management/application/storage/get-presigned-url'
import { R2PresignedUrl } from './presigned-url'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
    {
      provide: PresignedUrl,
      useClass: R2PresignedUrl,
    },
  ],
  exports: [Uploader, PresignedUrl],
})
export class StorageModule { }
