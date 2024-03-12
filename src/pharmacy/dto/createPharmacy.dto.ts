import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { DaysOfWeek, GeoZone } from 'src/Helpers/Config';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'LGA where pharmacy is located', example: 'Udi' })
  lga?: string;
  @IsArray({})
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'longitude and latitude of pharmacy respectively',
    example: [-122.5, 37.7],
  })
  coordinates?: number[];
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Town or City Pharmacy is situated at', example: 'New Haven' })
  address_town?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, description: 'Pharmacy address line 1', example: '24 Mbadinuju street new haven' })
  address_line_1: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'First nearest landmark to pharmacy', example: 'New Haven' })
  address_landmark_1?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Pharmacy address line 2', example: '24 kunjingworo street new haven' })
  address_line_2?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Second nearest landmark to pharmacy', example: 'New Haven' })
  address_landmark_2?: string;
}

class WorkHoursDto {
  @IsString()
  @IsEnum(DaysOfWeek)
  @ApiProperty({ example: 'Monday', enum: DaysOfWeek })
  day: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '8:00' })
  @Matches(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/)
  open: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '21:00' })
  @Matches(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/)
  close: string;
}

export class CreatePharmacyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Juhel Pharmacy Ltd' })
  pharmacy_name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '08149575338' })
  pharmacy_phone_number: string;
  @ValidateNested()
  @ApiProperty({
    description: 'Address details of the pharmacy',
    type: AddressDto, // Reference AddressDto for structure
  })
  pharmacy_address: AddressDto;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Enugu' })
  pharmacy_state: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'info@juhel.com' })
  pharmacy_email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2003' })
  pharmacy_founding_year: string;
  @IsString()
  @IsNotEmpty()
  @IsEnum(GeoZone)
  @ApiProperty({ description: 'Geopolitical zone where Pharmacy is located', enum: GeoZone })
  pharmacy_geo_zone: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nigeria' })
  pharmacy_country: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '09AEDC23' })
  pharmacy_cac_no: string;
  @ValidateNested({ each: true })
  @ApiProperty({
    example: [
      { day: 'Monday', open: '08:00', close: '18:00' },
      { day: 'Tuesday', open: '09:00', close: '19:00' },
    ],
    description: 'Array of pharmacy working hours',
    type: [WorkHoursDto],
  })
  pharmacy_working_hour: WorkHoursDto[];
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, example: true, description: 'true if head and false if branch', default: true })
  head: boolean;
}
