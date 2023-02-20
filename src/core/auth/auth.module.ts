import { Module } from '@nestjs/common';
import { AuthService } from 'core/auth/auth.service';
import { AuthController } from 'core/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from 'core/strategy/at.strategy';
import { RtStrategy } from 'core/strategy/rt.strategy';
import { OptionsService } from 'core/options/options.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, OptionsService],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
