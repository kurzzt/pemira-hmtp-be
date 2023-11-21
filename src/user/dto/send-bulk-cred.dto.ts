import { IsArray, IsNotEmpty } from 'class-validator';

export class SendBulkCredDto {
  @IsNotEmpty()
  @IsArray()
  readonly user: string[];
}
