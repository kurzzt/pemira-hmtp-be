import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Configure {
  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  active: boolean;
}

export const ConfigureSchema = SchemaFactory.createForClass(Configure);
