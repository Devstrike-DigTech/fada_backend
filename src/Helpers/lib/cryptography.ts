import { InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { ENCRYPTION_KEY } from '../Config';

export class Cryptography {
  public static async hash(plain: string) {
    try {
      return await argon2.hash(plain);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  public static async verify(hash: string, plain: string) {
    try {
      return await argon2.verify(hash, plain);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  public static encrypt(text: string) {
    //generate iv
    const iv = crypto.randomBytes(16).toString('hex');
    // Create an AES cipher with a 256-bit key
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));

    // Encrypt the text
    let encryptedText = cipher.update(text, 'utf-8', 'hex');
    encryptedText += cipher.final('hex');

    return {
      encryptedText,
      initializationVector: iv,
    };
  }

  public static decrypt(encryptedText: string, initializationVector: string): string {
    try {
      // Create an AES decipher with the same key
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(initializationVector, 'hex'),
      );

      // Decrypt the text
      let decryptedText = decipher.update(encryptedText, 'hex', 'utf-8');
      decryptedText += decipher.final('utf-8');

      return decryptedText;
    } catch (e) {
      console.log(e);
    }
  }
}
