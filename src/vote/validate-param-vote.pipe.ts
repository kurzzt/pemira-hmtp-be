import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { VoteService } from './vote.service';

@Injectable()
export class ValidateVoteParamId implements PipeTransform<string> {
  constructor(private voteService: VoteService) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (isValidObjectId(value)) {
      const user = await this.voteService.isExist(value);
      if (!user)
        throw new BadRequestException(`Cant find Vote with ${value} IDs`);
      else return value;
    }
    throw new BadRequestException('Please enter a corrent Mongo ID');
  }
}
