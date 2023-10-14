import { Injectable, UseGuards } from '@nestjs/common';
import { Options, Prisma } from '@prisma/client';
import { DbService } from 'core/db/db.service';
import { UserDto } from 'core/user/dtos/user.dto';
import { JwtGuard } from 'core/auth/guards/jwt.guard';
import { OptionsDto } from './dto/options.dto';

@Injectable()
export class OptionsService {
  constructor(private dbService: DbService) {}

  @UseGuards(JwtGuard)
  async getOptions(user: UserDto): Promise<{ options: OptionsDto }> {
    const options = await this.dbService.options.findUnique({
      where: { userId: user.id },
    });
    const { ...optionsDto } = new OptionsDto(options);

    return { options: optionsDto };
  }

  async updateOptions(
    user: UserDto,
    options: Options,
  ): Promise<{ optionsUpdate: OptionsDto }> {
    const optionsUpdate = await this.dbService.options.update({
      where: { userId: user.id },
      data: {
        breaths: options.breaths,
        inhale: new Prisma.Decimal(options.inhale),
        exhale: new Prisma.Decimal(options.exhale),
        hold: options.hold,
      },
    });
    const { ...optionsDto } = new OptionsDto(optionsUpdate);

    return { optionsUpdate: optionsDto };
  }

  async createOptions(user: UserDto): Promise<OptionsDto> {
    const options = await this.dbService.options.create({
      data: {
        userId: user.id,
        breaths: 30,
        inhale: new Prisma.Decimal(1.7),
        exhale: new Prisma.Decimal(1.7),
        hold: 50,
      },
    });
    const { ...optionsDto } = new OptionsDto(options);

    return optionsDto;
  }
}
