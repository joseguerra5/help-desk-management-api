import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationSecret } from '@/domain/management/application/auth/two-factor-secret-generator';
import { TwoFactorAuthenticationCodeValidation } from '@/domain/management/application/auth/two-factor-auth-code-valid';
import { QrCodeGenerator } from '../2fa/qr-code-generator';
import { OtpAuthUrl } from '../2fa/two-factor-secret-generator';
import { PrismaService } from '../database/prisma/prisma.service';
import { GenerateQrCode } from '@/domain/management/application/auth/generate-qr-code';

@Module({
  providers: [
    PrismaService,
    {
      provide: GenerateQrCode,
      useClass: QrCodeGenerator,
    },
    {
      provide: TwoFactorAuthenticationSecret,
      useClass: OtpAuthUrl,
    },
    {
      provide: TwoFactorAuthenticationCodeValidation,
      useClass: OtpAuthUrl,
    },
  ],
  exports: [GenerateQrCode, TwoFactorAuthenticationSecret, TwoFactorAuthenticationCodeValidation],
})
export class TwofaModule { }
