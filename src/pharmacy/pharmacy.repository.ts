import { DbRepository } from 'src/Helpers/DB/db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IPharmacy } from './pharmacy.interface';
import { PHARMACY_MODEL } from '../Helpers/Config';

@Injectable()
export class PharmacyRepository extends DbRepository<IPharmacy> {
  constructor(@InjectModel(PHARMACY_MODEL) pharmacyModel: Model<IPharmacy>) {
    super(pharmacyModel);
  }
}
