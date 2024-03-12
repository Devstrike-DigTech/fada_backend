import { BadRequestException, Injectable } from '@nestjs/common';
import { PharmacyRepository } from './pharmacy.repository';
import { CreatePharmacyDto } from './dto/createPharmacy.dto';
import Phone from '../Helpers/lib/phone.lib';

@Injectable()
export class PharmacyService {
  constructor(private readonly PharmacyRepository: PharmacyRepository) {}

  public async createPharmacy(payload: CreatePharmacyDto) {
    if (!Phone.format_validate(payload.pharmacy_phone_number)) throw new BadRequestException('Phone number not valid');

    return await this.PharmacyRepository.create({}, payload);
  }
}
