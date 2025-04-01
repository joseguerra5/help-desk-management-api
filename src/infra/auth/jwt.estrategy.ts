import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from '@/infra/env/env';
import { z } from 'zod';

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  isTwoFactorAuthenticated: z.boolean().default(false),
  isTwoFactorAuthenticationEnabled: z.boolean().optional(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKey: Buffer.from(publicKey, 'base64'),
    });
  }

  async validate(payload: UserPayload) {
    const parsedPayload = tokenPayloadSchema.parse(payload);

    if (!parsedPayload.isTwoFactorAuthenticated) {
      throw new UnauthorizedException("Autenticação de dois fatores não confirmada.");
    }

    return parsedPayload
  }
}
