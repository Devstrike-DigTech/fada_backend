import { Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
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
  // google_id: {
  //   type: String,
  //   unique: true,
  //   index: true,
  // },
  phone: {
    type: String,
    unique: true,
    index: true,
  },
  pcn: {
    type: String,
    unique: true,
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
  active: {
    type: Boolean,
    default: false,
  },
});

// userSchema.index({ email: 1, google_id: 1, fada_id: 1, phone: 1 });
userSchema.index({ email: 1, fada_id: 1, phone: 1 });
