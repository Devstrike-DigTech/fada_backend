import * as dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL;
export const PORT = process.env.PORT;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const GOOGLE_OAUTH_SECRET_KEY = process.env.GOOGLE_OAUTH_SECRET_KEY;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
