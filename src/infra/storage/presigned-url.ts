

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { PresignedUrl } from '@/domain/management/application/storage/get-presigned-url'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class R2PresignedUrl implements PresignedUrl {
  // conexão com o cloudflare
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')
    const accessKeyId = envService.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = envService.get('AWS_SECRET_ACCESS_KEY')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }
  async presignedUrl(fileKey: string): Promise<{ url: string }> {

    console.log("fileKey no service", fileKey)
    const bucketName = this.envService.get('AWS_BUCKET_NAME')


    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 }); // 1 hora

    return { url }
  }
}

