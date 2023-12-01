import { IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateConfigureDto {
  @IsNotEmpty()
  @IsDateString()
  readonly start_date: string;

  @IsNotEmpty()
  @IsDateString()
  readonly end_date: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly active: boolean;
}
