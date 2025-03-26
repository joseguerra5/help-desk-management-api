import { PresignedUrl } from '@/domain/management/application/storage/get-presigned-url';
import { randomUUID } from 'node:crypto';

interface URL {
  url: string;
}
export class FakePresignedUrl implements PresignedUrl {
  public urls: URL[] = [];

  async presignedUrl(fileKey: string): Promise<{ url: string; }> {
    const url = `${randomUUID()} - ${fileKey}`;

    this.urls.push({
      url,
    });

    return { url };
  }
}
