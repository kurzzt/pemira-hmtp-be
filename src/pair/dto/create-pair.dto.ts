import { IsArray, IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Pair } from '../schema/pair.schema';

export class CreatePairDto implements Pair {
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

  @IsEmpty()
  readonly yearNomination: number;
}
