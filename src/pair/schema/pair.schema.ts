import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Pair {
  @Prop({
    required: [true, 'Leader required'],
  })
  leader: string;

  @Prop({
    required: [true, 'Sub Leader required'],
  })
  subLeader: string;

  @Prop({
    required: [true, 'Visi required'],
  })
  visi: string;

  @Prop({
    required: [true, 'Misi required'],
  })
  misi: string[];

  @Prop({
    required: [true, 'Image required'],
  })
  imgURL: string;

  @Prop({
    required: [true, 'Number required'],
  })
  number: number;

  @Prop({
    default: new Date().getFullYear(),
  })
  yearNomination: number;
}

export const PairSchema = SchemaFactory.createForClass(Pair);
