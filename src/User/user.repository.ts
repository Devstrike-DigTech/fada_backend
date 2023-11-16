import { Injectable } from '@nestjs/common';
import { IUser } from './user.interface';
import { DbRepository } from 'src/Helpers/DB/db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/Helpers/Config';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends DbRepository<IUser> {
  constructor(@InjectModel(USER_MODEL) userModel: Model<IUser>) {
    super(userModel);
  }

  async isEmailExist(email): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async isPhone(phone: string): Promise<boolean> {
    return (await this.model.findOne({ phone })) ? true : false;
  }
}
