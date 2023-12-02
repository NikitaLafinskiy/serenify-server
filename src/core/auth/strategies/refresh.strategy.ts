import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { TokensService } from 'core/tokens/tokens.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly tokenService: TokensService) {
    super(async (req: Request, done) => {
      if (req.headers.authorization) {
        const bearerTokenUUID = req.headers.authorization;
        const tokenUUID = bearerTokenUUID.split(' ')[1];
        const { user } = await this.tokenService.getAndVerifyRefreshToken(
          tokenUUID,
        );

        if (!user) {
          return done(new UnauthorizedException('Invalid refresh token'), null);
        }

        return done(null, user);
      } else if (!req.headers.authorization) {
        return done('User is not registered', null);
      }
    });
  }
}
