import { Prop, raw, Schema } from '@nestjs/mongoose';
import { Image } from './image.schema';

@Schema({ _id: false })
export class Variant {
  @Prop({ type: String })
  public id: string;

  @Prop({ type: Boolean })
  public available: boolean;

  @Prop(
    raw({
      packaging: { type: String },
      description: { type: String },
    }),
  )
  public attributes: {
    packaging: string;
    description: string;
  };

  @Prop({ type: Number })
  public cost: number;

  @Prop({ type: String })
  public currency: string;

  @Prop({ type: Number })
  public depth: number;

  @Prop({ type: String })
  public description: string;

  @Prop({ type: String })
  public dimensionUom: string;

  @Prop({ type: Number })
  public height: number;

  @Prop({ type: Number })
  public width: number;

  @Prop({ type: String })
  public manufacturerItemCode: string;

  @Prop({ type: String })
  public manufacturerItemId: string;

  @Prop({ type: String })
  public packaging: string;

  @Prop({ type: Number })
  public price: number;

  @Prop({ type: Number })
  public volume: number;

  @Prop({ type: String })
  public volumeUom: string;

  @Prop({ type: Number })
  public weight: number;

  @Prop({ type: String })
  public weightUom: string;

  @Prop({ type: String })
  public optionName: string;

  @Prop({ type: String })
  public sku: string;

  @Prop({ type: Boolean })
  public active: boolean;

  @Prop({ type: [Image] })
  public images: Image[];

  @Prop({ type: String })
  public itemCode: string;
}
