import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DRUG_MODEL } from '../Helpers/Config';
import { drugSchema } from './drug.model';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: DRUG_MODEL, schema: drugSchema }])],
})
export class UserModule {}
