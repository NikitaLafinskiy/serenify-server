import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'core/auth/auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { Public } from 'core/auth/decorators/public.decorator';
import { GetPayload } from 'core/decorators/get-payload.decorator';
import { UserDto } from 'core/user/dtos/user.dto';
import { RtGuard } from 'core/auth/guards/refresh.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() authDto: AuthDto) {
    const { accessToken, refreshTokenId, user } = await this.authService.singup(
      authDto,
    );

    return { user, accessToken, refreshTokenId };
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { accessToken, refreshTokenId, user } = await this.authService.login(
      authDto,
    );

    return { user, accessToken, refreshTokenId };
  }

  @UseGuards(RtGuard)
  @Get('refresh')
  async refresh(@Req() req) {
    const { accessToken, refreshTokenId, user } =
      await this.authService.refresh(req.user);

    return { user, accessToken, refreshTokenId };
  }
}
