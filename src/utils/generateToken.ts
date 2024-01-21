import crypto from 'crypto';
import { secret } from 'config';

export const generateToken = (key: string) => {
  const timestamp = Date.now();
  if (!secret) {
    throw new Error('Secret is not defined');
  }
  return crypto.createHmac('sha256', secret)
    .update(key + timestamp.toString())
    .digest('hex');
};
