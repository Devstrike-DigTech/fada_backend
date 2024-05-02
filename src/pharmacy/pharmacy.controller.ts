import { ApiTags, ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto } from './dto/createPharmacy.dto';
import { AccessTokenGuard } from '../Shared/guards';
import { Request } from 'express';

@ApiTags('Pharmacy')
@ApiBasicAuth()
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  public async signup(@Body() body: CreatePharmacyDto, @Req() req: Request) {
    const pharmacy = await this.pharmacyService.createPharmacy(body, (req.user as any).id);

    return { data: pharmacy, msg: 'success' };
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  public async getLoggedInPharmacy(@Req() req: Request) {
    const pharmacy = await this.pharmacyService.getPharmacy({ pharmacy_owner_id: (req.user as any).id });

    return { data: pharmacy, msg: 'success' };
  }
}
