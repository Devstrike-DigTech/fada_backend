import { Document } from 'mongoose';

export interface IUser extends Document {
  fada_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  google_id: string;
  phone: string;
  dob: string;
  role: string; //enum
  isVerified: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}
