import { Module } from '@nestjs/common';
import { DbService } from 'core/db/db.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, DbService],
  controllers: [UserController],
})
export class UserModule {}
