import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { UserService } from './user.service';

@Injectable()
export class ValidateUserParamId implements PipeTransform<string> {
  constructor(private userService: UserService) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (isValidObjectId(value)) {
      const user = await this.userService.isExist(value);
      if (!user)
        throw new BadRequestException(`Cant find User with ${value} IDs`);
      else return value;
    }
    throw new BadRequestException('Please enter a corrent Mongo ID');
  }
}
