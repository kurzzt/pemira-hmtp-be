import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  readonly user: string;
  
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}