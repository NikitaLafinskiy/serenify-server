import { Body, Controller, Get, Put } from '@nestjs/common';
import { Options } from '@prisma/client';
import { GetPayload } from 'core/decorators/get-payload.decorator';
import { UserDto } from 'core/user/dtos/user.dto';
import { OptionsService } from './options.service';

@Controller('options')
export class OptionsController {
  constructor(private optionsService: OptionsService) {}

  @Get('get')
  async getOptions(@GetPayload() user: UserDto) {
    const { options } = await this.optionsService.getOptions(user);
    return { options };
  }

  @Put('update')
  async updateOptions(@GetPayload() user: UserDto, @Body() options: Options) {
    const { optionsUpdate } = await this.optionsService.updateOptions(
      user,
      options,
    );

    return { optionsUpdate };
  }
}
