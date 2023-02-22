import { IsNotEmpty, IsNumber } from 'class-validator';

export class OptionsDto {
  @IsNumber()
  @IsNotEmpty()
  breaths: number;

  @IsNumber()
  @IsNotEmpty()
  inhale: number;

  @IsNumber()
  @IsNotEmpty()
  exhale: number;

  @IsNumber()
  @IsNotEmpty()
  hold: number;

  constructor({ breaths, inhale, exhale, hold }) {
    this.breaths = breaths;
    this.inhale = inhale;
    this.exhale = exhale;
    this.hold = hold;
  }
}
