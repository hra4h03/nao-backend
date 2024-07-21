import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ManufacturerDocument = HydratedDocument<Manufacturer>;

@Schema()
export class Manufacturer {
  @Prop()
  public name: string;

  @Prop({ unique: true })
  public id: number;

  @Prop()
  public code: string;
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
