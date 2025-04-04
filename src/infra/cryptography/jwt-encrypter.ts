import { Encrypter } from '@/domain/management/application/cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private JwtService: JwtService) {}
  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.JwtService.signAsync(payload);
  }
}
