import jwt from 'jsonwebtoken';
import { Response } from 'express';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export const generateTokens = (userId: number, role: string) => {
  const accessToken = jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  
  const refreshToken = jwt.sign({ userId, role }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    path: '/api/auth/refresh',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
};
