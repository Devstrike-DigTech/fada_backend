import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'username | fada id | email of user',
    examples: ['johndoe-nwamams', 'CS98-94-JD', 'johndoe@gmail.com'],
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(8)
  @ApiProperty({ example: 'test1234', maxLength: 8 })
  password: string;
}
