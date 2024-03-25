import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe@' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @ApiProperty({ example: '123456', maxLength: 6 })
  otp: string;

  @IsString()
  @MaxLength(8)
  @IsNotEmpty()
  @ApiProperty({ example: 'test1234', maxLength: 8 })
  password: string;
}
