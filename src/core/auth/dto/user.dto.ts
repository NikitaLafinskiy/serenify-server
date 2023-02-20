import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor({
    id,
    username,
    createdAt,
    updatedAt,
  }: {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
