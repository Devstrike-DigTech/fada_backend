import { Injectable } from '@nestjs/common';
import { IDrug } from './drug.interface';
import { DbRepository } from 'src/Helpers/DB/db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { DRUG_MODEL } from 'src/Helpers/Config';
import { Model } from 'mongoose';

@Injectable()
export class DrugRepository extends DbRepository<IDrug> {
  constructor(@InjectModel(DRUG_MODEL) userModel: Model<IDrug>) {
    super(userModel);
  }
}
