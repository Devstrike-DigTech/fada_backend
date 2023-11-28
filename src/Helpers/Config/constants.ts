export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

/**
 * Database Collection Names
 */
export const USER_MODEL = 'users';
export const AUTH_MGT_MODEL = 'authMgt';
/**
 * constants
 */
export enum ROLE {
  CUSTOMER = 'customer',
  PHARMACIST = 'pharmacist',
  DISTRIBUTOR = 'distributor',
  OPERATOR = 'operator',
}
export const OTP_TTL = 10 * 60; //10 minutes

export const ACCESS_TOKEN_TTL = '15m';
export const REFRESH_TOKEN_TTL = '7d';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';
export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN_COOKIE_TTL = 7 * 24 * 60 * 60 * 1000;
