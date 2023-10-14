import { Module } from '@nestjs/common';
import { AuthService } from 'core/auth/auth.service';
import { AuthController } from 'core/auth/auth.controller';
import { JwtStrategy } from 'core/auth/strategies/jwt.strategy';
import { RefreshStrategy } from 'core/auth/strategies/refresh.strategy';
import { OptionsService } from 'core/options/options.service';
import { TokensService } from 'core/tokens/tokens.service';
import { UserService } from 'core/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    OptionsService,
    TokensService,
    UserService,
    JwtService,
  ],
})
export class AuthModule {}
