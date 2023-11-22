import { InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

export class EncryptDecrypt {
  public static async encrypt(plain: string) {
    try {
      const hash = await argon2.hash(plain);

      return hash;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  public static async decrypt(hash: string, plain: string) {
    try {
      if (await argon2.verify(hash, plain)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
