import { Schema, Model, Types } from 'mongoose';
import { IUser } from './user.interface';
import { ROLE } from 'src/Helpers/Config';

export const userSchema = new Schema<IUser>({
  fada_id: {
    type: String,
    index: true,
    unique: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    index: true,
  },
  password: {
    type: String,
  },
  google_id: {
    type: String,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
    unique: true,
    index: true,
  },
  dob: {
    type: String,
  },
  role: {
    type: String,
    enum: ROLE,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  refresh_token: {
    type: [String],
  },
  active: {
    type: Boolean,
    default: false,
  },
});

userSchema.index({ email: 1 });
