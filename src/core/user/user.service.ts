import { Injectable } from '@nestjs/common';
import { UserDto } from 'core/user/dtos/user.dto';
import { DbService } from 'core/db/db.service';
import { OptionsDto } from 'core/options/dto/options.dto';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  async getUserByUsername(username: string): Promise<UserDto> {
    const user = await this.dbService.user.findUnique({ where: { username } });
    const { ...userDto } = new UserDto(user);

    return userDto;
  }

  async getUserOptions(
    username: string,
  ): Promise<{ user: UserDto; options: OptionsDto }> {
    const user = await this.getUserByUsername(username);

    const options = await this.dbService.options.findUnique({
      where: { userId: user.id },
    });

    const { ...optionsDto } = new OptionsDto(options);
    const { ...userDto } = new UserDto(user);

    return { user: userDto, options: optionsDto };
  }
}
