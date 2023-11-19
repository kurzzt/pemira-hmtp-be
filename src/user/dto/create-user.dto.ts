import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsNIMUnique } from '../uniqueNIM.decorator';
import { IsEmailUnique } from '../uniqueEmail.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsBoolean()
  readonly isAdmin: boolean;

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

  @ValidateIf((o) => o.isAdmin === false)
  @IsNumber()
  @IsNotEmpty()
  @Max(new Date().getFullYear())
  readonly yearClass: number;

  @ValidateIf((o) => o.isAdmin)
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
