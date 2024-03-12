import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PHARMACY_MODEL } from '../Helpers/Config';
import { pharmacySchema } from './pharmacy.model';
import { PharmacyRepository } from './pharmacy.repository';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';

@Module({
  providers: [PharmacyRepository, PharmacyService],
  imports: [MongooseModule.forFeature([{ name: PHARMACY_MODEL, schema: pharmacySchema }])],
  controllers: [PharmacyController],
  // exports: [PharmacyRepository],
})
export class PharmacyModule {}
