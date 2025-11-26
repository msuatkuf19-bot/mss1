import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  restaurantId?: string;
}

export const generateToken = (payload: JWTPayload, expiresIn?: string): string => {
  const secret = config.jwt.secret as string;
  const expiry = expiresIn || (config.jwt.expiresIn as string);
  const options: SignOptions = {
    expiresIn: expiry as any,
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const secret = config.jwt.secret as string;
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

