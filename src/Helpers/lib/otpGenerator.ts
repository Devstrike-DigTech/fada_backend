import * as rand from 'randomstring';

export class OTPGenerator {
  public static generate() {
    return rand.generate({ length: 6, charset: 'numeric' });
  }
}
