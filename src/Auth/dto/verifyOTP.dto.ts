import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOTPDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe@gmail.com' })
  email: string;

  @IsString()
  @MaxLength(6)
  @ApiProperty({ example: '123456', maxLength: 6 })
  otp: string;
}
