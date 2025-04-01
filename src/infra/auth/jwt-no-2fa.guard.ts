
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtNo2FAAuthGuard extends AuthGuard('jwt-no-2fa') { } // Definimos a estratégia correta
