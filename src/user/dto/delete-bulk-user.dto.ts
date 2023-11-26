import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteBulkDto {
  @IsNotEmpty()
  @IsArray()
  readonly user: string[];
}
