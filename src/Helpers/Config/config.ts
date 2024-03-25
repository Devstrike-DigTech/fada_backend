import * as dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL;
export const PORT = process.env.PORT;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const GOOGLE_OAUTH_SECRET_KEY = process.env.GOOGLE_OAUTH_SECRET_KEY;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const APPLICATION_NAME = process.env.APPLICATION_NAME;
export const COMPANY_NAME = process.env.COMPANY_NAME;

export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_PORT = process.env.REDIS_PORT;
