import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'core/auth/auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { Public } from 'core/decorators/public.decorator';
import { GetPayload } from 'core/decorators/get-payload.decorator';
import { UserDto } from 'core/auth/dto/user.dto';
import { RtGuard } from 'core/guards/rt.guard';
import { setAuthCookie } from 'utils/auth/setAuthCookie.utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken, user } = await this.authService.singup(
      authDto,
    );
    setAuthCookie(res, refreshToken);

    return { user, accessToken };
  }

  @Public()
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      authDto,
    );
    setAuthCookie(res, refreshToken);
    return { user, accessToken };
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  async refresh(
    @GetPayload() userDto: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.refresh(
      userDto,
    );
    setAuthCookie(res, refreshToken);

    return { user, accessToken };
  }
}
