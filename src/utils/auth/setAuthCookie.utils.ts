import { Response } from 'express';

export const setAuthCookie = (response: Response, refreshToken: string) => {
  response.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
