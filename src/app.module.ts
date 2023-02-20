import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'core/db/db.module';
import { AuthModule } from 'core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from 'core/guards/at.guard';
import { OptionsModule } from './core/options/options.module';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OptionsModule,
  ],
  controllers: [],
  providers: [
    ConfigModule,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
