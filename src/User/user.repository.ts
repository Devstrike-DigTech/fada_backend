import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { DbRepository } from 'src/Helpers/DB/db.repository';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/Helpers/Config';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends DbRepository<IUser> {
  constructor(@InjectModel(USER_MODEL) userModel: Model<IUser>) {
    super(userModel);
  }

  async isEmailExist(email: string): Promise<IUser | null> {
    return await this.findOne({ email }, { email: 1, phone: 1, isVerified: 1 });
  }

  async isPhone(phone: string): Promise<boolean> {
    return !!(await this.model.findOne({ phone }));
  }

  async findOneFromUniqueIdentifiers(condition: Partial<Record<keyof IUser, string>>[]): Promise<IUser | null> {
    return this.model.findOne({ $or: condition });
  }
}
