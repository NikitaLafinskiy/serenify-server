import { Request } from 'express';

export const cookieExtractor = (request: Request) => {
  let token = null;
  if (request.cookies['refreshToken']) {
    token = request.cookies['refreshToken'];
  }
  return token;
};
