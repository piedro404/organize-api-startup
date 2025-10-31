import dotenv from 'dotenv';
import type { Secret, SignOptions } from 'jsonwebtoken';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const TTL_CACHE = parseInt(process.env.TTL_CACHE || '300');
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const DATABASE_URL = process.env.DATABASE_URL;
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
export const JWT_SECRET: Secret = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN ?? '31d') as SignOptions['expiresIn'];

export const DATABASE_CONFIG = {
  url: DATABASE_URL,
  logQueries: NODE_ENV === 'development',
  maxConnections: NODE_ENV === 'production' ? 10 : 5,
};

export const AWS_CONFIG = {
  url: process.env.AWS_URL || '',
  usePathStyle: process.env.AWS_USE_PATH_STYLE_ENDPOINT === 'true',
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT || '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  bucket: process.env.AWS_BUCKET || 'adote-pets',
}