import { PresignedUrl, PresignedUrlParams } from '@/domain/management/application/storage/get-presigned-url';
import { randomUUID } from 'node:crypto';

interface URL {
  url: string;
}
export class FakePresignedUrl implements PresignedUrl {
  public urls: URL[] = [];

  async presignedUrl(fileKey: PresignedUrlParams): Promise<{ url: string; }> {
    console.log("aqui", fileKey)
    const url = `${randomUUID()} - ${fileKey}`;

    this.urls.push({
      url,
    });

    return { url };
  }
}
