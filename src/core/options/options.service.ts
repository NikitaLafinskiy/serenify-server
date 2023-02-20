import { Injectable, UseGuards } from '@nestjs/common';
import { Options, Prisma } from '@prisma/client';
import { DbService } from 'core/db/db.service';
import { UserDto } from 'core/auth/dto/user.dto';
import { AtGuard } from 'core/guards/at.guard';

@Injectable()
export class OptionsService {
  constructor(private dbService: DbService) {}

  @UseGuards(AtGuard)
  async getOptions(user: UserDto): Promise<{ options: Options }> {
    const options = await this.dbService.options.findUnique({
      where: { userId: user.id },
    });
    return { options };
  }

  async updateOptions(
    user: UserDto,
    options: Options,
  ): Promise<{ optionsUpdate: Options }> {
    const optionsUpdate = await this.dbService.options.update({
      where: { userId: user.id },
      data: {
        breaths: options.breaths,
        inhale: new Prisma.Decimal(options.inhale),
        exhale: new Prisma.Decimal(options.exhale),
        hold: options.hold,
      },
    });
    return { optionsUpdate };
  }

  async createOptions(user: UserDto): Promise<Options> {
    const options = await this.dbService.options.create({
      data: {
        userId: user.id,
        breaths: 30,
        inhale: new Prisma.Decimal(1.7),
        exhale: new Prisma.Decimal(1.7),
        hold: 50,
      },
    });

    return options;
  }
}
