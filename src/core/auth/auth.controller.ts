import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Req,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'core/auth/auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'core/auth/decorators/public.decorator';
import { RtGuard } from 'core/auth/guards/refresh.guard';

@Public()
@Controller('auth')
@Injectable({ scope: Scope.REQUEST })
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
