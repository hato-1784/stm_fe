import dotenv from 'dotenv';
dotenv.config();

export const secret = process.env.NEXT_PUBLIC_SECRET;
export const jwt_secret_key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
export const host = process.env.NEXT_PUBLIC_HOST;