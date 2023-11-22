import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifyOTPDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(6)
  otp: string;
}
