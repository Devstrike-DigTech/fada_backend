import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto } from './dto/createPharmacy.dto';

@ApiTags('Pharmacy')
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('')
  public async signup(@Body() body: CreatePharmacyDto) {
    const pharmacy = await this.pharmacyService.createPharmacy(body);

    return { data: pharmacy, msg: 'success' };
  }
}
