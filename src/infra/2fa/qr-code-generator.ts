import { Injectable } from '@nestjs/common';
import { toDataURL } from 'qrcode';
import { GenerateQrCode } from '@/domain/management/application/auth/generate-qr-code';

@Injectable()
export class QrCodeGenerator implements GenerateQrCode {
  async generateQrCode(otpAuthUrl: string): Promise<string> {
    return toDataURL(otpAuthUrl);
  }
}
