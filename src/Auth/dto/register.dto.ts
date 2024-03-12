import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ROLE } from 'src/Helpers/Config';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @IsString()
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ROLE)
  @ApiProperty({ description: 'Role of user', enum: ROLE })
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  pcn: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '10-16-1998' })
  dob: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '08149575338' })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'test1234' })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, example: '837733973729jd88' })
  google_id?: string;
}
