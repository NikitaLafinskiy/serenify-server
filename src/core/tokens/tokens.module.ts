import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DbService } from 'core/db/db.service';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, DbService],
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class TokensModule {}
