export abstract class PresignedUrl {
  abstract presignedUrl(fileKey: string): Promise<{ url: string }>;
}
