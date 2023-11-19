import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Vote } from 'src/vote/schema/vote.schema';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    unique: [true, 'Duplicate NIM entered'],
    required: [true, 'NIM required'],
  })
  nim: string;

  @Prop({
    unique: [true, 'Duplicate email entered'],
    required: [true, 'email required'],
  })
  email: string;

  @Prop({
    required: [true, 'Name required'],
  })
  name: string;

  @Prop({
    default: new Date().getFullYear(),
  })
  yearClass: number;

  @Prop({
    default: null,
    select: false,
  })
  password: string;

  @Prop({
    default: false,
    select: false,
  })
  isAdmin: boolean;

  @Prop({
    default: false,
  })
  voted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
