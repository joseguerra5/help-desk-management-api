import { TwoFactorAuthenticationSecret } from '@/domain/management/application/auth/two-factor-secret-generator';
import { Manager } from '@/domain/management/enterprise/entities/manager';
import { Injectable } from '@nestjs/common';
import { authenticator } from "otplib"
import { PrismaService } from '../database/prisma/prisma.service';
import { TwoFactorAuthenticationCodeValidation } from '@/domain/management/application/auth/two-factor-auth-code-valid';

@Injectable()
export class OtpAuthUrl implements TwoFactorAuthenticationSecret, TwoFactorAuthenticationCodeValidation {
  constructor(private prisma: PrismaService) { }
  async isTwoFactorAuthenticationCodeValid(manager: Manager, twoFactorAuthenticationCode: string): Promise<boolean> {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: manager.twoFactorAuthenticationSecret,
    });
  }
  async generateTwoFactorAuthenticationSecret(manager: Manager): Promise<{ secret: string; otpAuthUrl: string; }> {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(manager.email, 'MANAGER_INVENTORY', secret);

    await this.prisma.user.update({
      where: {
        id: manager.id.toString(),
      },
      data: {
        twoFactorAuthenticationSecret: secret
      }
    });

    return {
      secret,
      otpAuthUrl
    }
  }

}
