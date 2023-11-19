import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Pair } from 'src/pair/schema/pair.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({
  timestamps: true,
})
export class Vote {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'User required'],
    unique: [true, 'User Already Vote'],
  })
  user: User;

  @Prop({
    type: Types.ObjectId,
    ref: 'Pair',
    required: [true, 'Vote Information required'],
  })
  vote: Pair;

  @Prop({
    default: true,
  })
  isValid: boolean;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
