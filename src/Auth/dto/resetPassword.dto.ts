import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  otp: string;

  @IsString()
  @MaxLength(8)
  @IsNotEmpty()
  password: string;
}
