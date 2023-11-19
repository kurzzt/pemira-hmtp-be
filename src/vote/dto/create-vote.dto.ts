import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly vote: string;
}
