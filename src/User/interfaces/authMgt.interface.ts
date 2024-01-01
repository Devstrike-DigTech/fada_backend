import { Document, ObjectId } from 'mongoose';
import { IUser } from './user.interface';

export interface IAuthMgt extends Document {
  user_id: ObjectId | IUser;
  refresh_token: string;
  ip: string;
  user_agent: string;
  last_login: string;
  iv: string;
}
