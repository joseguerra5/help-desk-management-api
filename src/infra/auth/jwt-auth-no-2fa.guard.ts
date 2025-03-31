import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TwoFactorDisabledGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Usuário não autenticado.");
    }

    if (user.isTwoFactorAuthenticationEnabled) {
      throw new UnauthorizedException("A autenticação de dois fatores já está ativada.");
    }

    return true;
  }
}
