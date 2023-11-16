import { InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

export class EncryptDecrypt {
  public static async encrypt(password: string) {
    try {
      const hash = await argon2.hash('password');

      return hash;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  public static async decrypt(hash: string, password: string) {
    try {
      if (await argon2.verify(hash, password)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
