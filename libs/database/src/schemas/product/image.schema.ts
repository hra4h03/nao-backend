import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Image {
  @Prop({ type: String })
  public fileName: string;

  @Prop({ type: String })
  public cdnLink: string;

  @Prop({ type: Number })
  public i: number;

  @Prop({ type: String })
  public alt: string;
}
