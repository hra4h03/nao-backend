import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Variant } from './variant.schema';
import { Image } from './image.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  public name: string;

  @Prop()
  public type: string;

  @Prop()
  public shortDescription: string;

  @Prop()
  public description: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Vendor' })
  public vendorId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Product' })
  public productId: mongoose.Types.ObjectId;

  @Prop()
  public storefrontPriceVisibility: string;

  @Prop({ type: [Variant], default: [] })
  public variants: Array<Variant>;

  @Prop()
  public availability: string;

  @Prop()
  public isFragile: boolean;

  @Prop()
  public published: string;

  @Prop()
  public isTaxable: boolean;

  @Prop({ type: [Image] })
  public images: Image[];

  @Prop()
  public categoryId: string;

  @Prop()
  public category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
