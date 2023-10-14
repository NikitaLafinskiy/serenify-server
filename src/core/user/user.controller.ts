import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get')
  async getUserInfo(@Req() req) {
    const { user, options } = await this.userService.getUserOptions(
      req.user.username,
    );

    return { user, options };
  }
}
