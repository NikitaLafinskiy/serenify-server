import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { cookieExtractor } from 'utils';
import { UserDto } from 'core/auth/dto/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
    });
  }

  validate(payload) {
    const { ...userDto } = new UserDto(payload);
    return userDto;
  }
}
