import { SignOptions } from 'jsonwebtoken';

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessToken: {
    options: {
      expiresIn: '5d',
      algorithm: 'HS256',
    } as SignOptions,
  },
  refreshToken: {
    options: {
      expiresIn: '7d',
      algorithm: 'HS256',
    } as SignOptions,
  },
}; 