import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNIMUnique } from '../uniqueNIM.decorator';
import { IsEmailUnique } from '../uniqueEmail.decorator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(14)
  @MaxLength(14)
  @IsNIMUnique()
  readonly nim: string;

  @IsNotEmpty()
  @IsEmail()
  @IsEmailUnique()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(new Date().getFullYear())
  readonly yearClass: number;
}
