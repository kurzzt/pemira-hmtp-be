import { IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
import { Configure } from '../schema/configure.schema';

export class UpdateConfigureDto implements Configure {
  @IsNotEmpty()
  @IsDateString()
  readonly start_date: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly end_date: Date;

  @IsNotEmpty()
  @IsBoolean()
  readonly active: boolean;
}
