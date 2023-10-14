import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { JwtStrategy } from 'core/auth/strategies/jwt.strategy';
import { UserService } from 'core/user/user.service';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService, JwtStrategy, UserService],
  exports: [OptionsService],
})
export class OptionsModule {}
