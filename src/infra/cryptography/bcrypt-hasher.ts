import { HashComparer } from '@/domain/management/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/management/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptHasher implements HashComparer, HashGenerator {
  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
  hash(plain: string): Promise<string> {
    return hash(plain, 8);
  }
}
