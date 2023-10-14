import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { DbService } from 'core/db/db.service';
import { AuthDto } from 'core/auth/dto/auth.dto';
import { UserDto } from 'core/user/dtos/user.dto';
import { OptionsService } from 'core/options/options.service';
import { TokensService } from 'core/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly optionsService: OptionsService,
    private readonly tokenService: TokensService,
  ) {}

  async singup(authDto: AuthDto): Promise<{
    refreshToken: string;
    accessToken: string;
    user: UserDto;
    refreshTokenId: string;
  }> {
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
    const { ...tokens } = await this.tokenService.generateTokens(userDto);
    await this.optionsService.createOptions(userDto);

    return { ...tokens, user: userDto };
  }

  async login(authDto: AuthDto): Promise<{
    refreshToken: string;
    accessToken: string;
    user: UserDto;
    refreshTokenId: string;
  }> {
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
    const { ...tokens } = await this.tokenService.generateTokens(userDto);

    return { ...tokens, user: userDto };
  }

  async refresh(userDto: UserDto): Promise<{
    user: UserDto;
    accessToken: string;
    refreshToken: string;
    refreshTokenId: string;
  }> {
    const { ...tokens } = await this.tokenService.generateTokens(userDto);

    return { user: userDto, ...tokens };
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
}
