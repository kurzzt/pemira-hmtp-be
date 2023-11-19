import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { PairService } from './pair.service';

@Injectable()
export class ValidatePairParamId implements PipeTransform<string> {
  constructor(private pairService: PairService) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (isValidObjectId(value)) {
      const user = await this.pairService.isExist(value);
      if (!user)
        throw new BadRequestException(`Cant find Paslon with ${value} IDs`);
      else return value;
    }
    throw new BadRequestException('Please enter a corrent Mongo ID');
  }
}
