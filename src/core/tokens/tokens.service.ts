import {
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'core/user/dtos/user.dto';
import { DbService } from 'core/db/db.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly dbService: DbService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(userDto: UserDto): Promise<{
    refreshToken: string;
    accessToken: string;
    refreshTokenId: string;
  }> {
    const payload = { sub: userDto.id, username: userDto.username };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_ACCESS_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    const refreshTokenCreated = await this.dbService.refreshToken.upsert({
      where: { userId: userDto.id },
      create: { token: refreshToken, userId: userDto.id },
      update: { token: refreshToken, userId: userDto.id },
    });

    const refreshTokenId = refreshTokenCreated.id;

    return { refreshToken, accessToken, refreshTokenId };
  }

  async getAndVerifyRefreshToken(
    refreshTokenId: string,
  ): Promise<{ user: UserDto }> {
    const refreshToken = await this.dbService.refreshToken.findUnique({
      where: { id: refreshTokenId },
    });
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const token = refreshToken.token;

    const payload = this.jwtService.verify(token, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
    if (!payload) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    const user = await this.dbService.user.findUnique({
      where: { id: payload.sub },
    });
    const { ...userDto } = new UserDto(user);

    return { user: userDto };
  }
}
