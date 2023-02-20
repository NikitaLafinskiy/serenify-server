import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { DbService } from 'core/db/db.service';
import { AuthDto } from 'core/auth/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'core/auth/dto/user.dto';
import { OptionsService } from 'core/options/options.service';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DbService,
    private jwt: JwtService,
    private config: ConfigService,
    private optionsService: OptionsService,
  ) {}

  async singup(
    authDto: AuthDto,
  ): Promise<{ refreshToken: string; accessToken: string; user: UserDto }> {
    const userDoesExist = await this.dbService.user.findUnique({
      where: { username: authDto.username },
    });
    if (userDoesExist) {
      throw new BadRequestException();
    }

    const { hashedPassword } = await this.hashPassword(authDto.password);
    const user = await this.dbService.user.create({
      data: { username: authDto.username, password: hashedPassword },
    });

    const { ...userDto } = new UserDto(user);
    const { ...tokens } = await this.generateTokens(userDto);
    await this.optionsService.createOptions(userDto);

    return { ...tokens, user: userDto };
  }

  async login(authDto: AuthDto) {
    const user = await this.dbService.user.findUnique({
      where: { username: authDto.username },
    });
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    const { isMatch } = await this.verifyPassword(
      user.password,
      authDto.password,
    );
    if (!isMatch) {
      throw new ForbiddenException('Passwords do not match');
    }

    const { ...userDto } = new UserDto(user);
    const { ...tokens } = await this.generateTokens(userDto);

    return { ...tokens, user: userDto };
  }

  async generateTokens(
    userDto: UserDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const accessToken = this.jwt.sign(userDto, {
      expiresIn: '15m',
      secret: this.config.get('JWT_ACCESS_SECRET'),
    });
    const refreshToken = this.jwt.sign(userDto, {
      expiresIn: '30d',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    await this.dbService.refreshToken.upsert({
      where: { userId: userDto.id },
      create: { token: refreshToken, userId: userDto.id },
      update: { token: refreshToken, userId: userDto.id },
    });

    return { refreshToken, accessToken };
  }

  async hashPassword(password: string): Promise<{ hashedPassword: string }> {
    const hashedPassword = await argon.hash(password);
    return { hashedPassword };
  }

  async verifyPassword(
    hash: string,
    password: string,
  ): Promise<{ isMatch: boolean }> {
    const isMatch = await argon.verify(hash, password);
    return { isMatch };
  }

  async refresh(
    userDto: UserDto,
  ): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
    const { refreshToken, accessToken } = await this.generateTokens(userDto);
    return { user: userDto, refreshToken, accessToken };
  }
}
