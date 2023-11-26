import { DbRepository } from '../Helpers/DB/db.repository';
import { Injectable } from '@nestjs/common';
import { IAuthMgt } from './interfaces/authMgt.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AUTH_MGT_MODEL } from '../Helpers/Config';
import { Model } from 'mongoose';

@Injectable()
export class AuthMgtRepository extends DbRepository<IAuthMgt> {
  constructor(@InjectModel(AUTH_MGT_MODEL) authMgtModel: Model<IAuthMgt>) {
    super(authMgtModel);
  }
}
