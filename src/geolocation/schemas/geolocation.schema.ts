import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GeolocationDocument = Geolocation & Document;

@Schema({ versionKey: false, timestamps: true })
export class Geolocation {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  coordinates: [number, number];
}

export const GeolocationSchema = SchemaFactory.createForClass(Geolocation);
