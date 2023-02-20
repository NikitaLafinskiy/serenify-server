import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { AtStrategy } from 'core/strategy/at.strategy';
import { DbService } from 'core/db/db.service';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService, AtStrategy],
  exports: [OptionsService],
})
export class OptionsModule {}
