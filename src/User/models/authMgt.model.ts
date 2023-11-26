import { Schema, Model, Types } from 'mongoose';
import { IAuthMgt } from '../interfaces/authMgt.interface';

export const authMgtSchema = new Schema<IAuthMgt>({
  user_id: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  user_agent: {
    type: String,
    required: true,
  },
  last_login: {
    type: String,
    required: true,
  },
});
