import { Schema, Model, Types } from 'mongoose';
import { IUser } from './user.interface';
import { ROLE } from 'src/Helpers/Config';

export const userSchema = new Schema<IUser>({
  fada_id: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  google_id: {
    type: String,
  },
  phone: {
    type: String,
  },
  dob: {
    type: String,
  },
  role: {
    type: String,
    enum: ROLE,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
  },
});
