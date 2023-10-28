import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'core/db/db.module';
import { AuthModule } from 'core/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'core/auth/guards/jwt.guard';
import { OptionsModule } from './core/options/options.module';
import { TokensModule } from './core/tokens/tokens.module';
import { UserService } from './core/user/user.service';
import { UserModule } from './core/user/user.module';
import { GlobalExceptionFilter } from 'global.filter';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OptionsModule,
    TokensModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    ConfigModule,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    UserService,
  ],
})
export class AppModule {}
