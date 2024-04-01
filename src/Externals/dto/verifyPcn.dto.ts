import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPcnDto {
  @ApiProperty({ example: '025992', description: 'Pharmacist PCN' })
  @IsNotEmpty()
  pcn: string;
}
