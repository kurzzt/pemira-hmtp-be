import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePairDto {
  @IsNotEmpty()
  @IsString()
  readonly leader: string;

  @IsNotEmpty()
  @IsString()
  readonly subLeader: string;

  @IsNotEmpty()
  @IsString()
  readonly visi: string;

  @IsNotEmpty()
  @IsArray()
  readonly misi: string[];

  @IsNotEmpty()
  @IsString()
  readonly imgURL: string;

  @IsNotEmpty()
  @IsNumber()
  readonly number;
}
