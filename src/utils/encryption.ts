import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '@config/index';

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> =>
  await bcrypt.compare(password, hashedPassword);

export const generateSalt = async (rounds: number = SALT_ROUNDS): Promise<string> =>
  await bcrypt.genSalt(rounds);
