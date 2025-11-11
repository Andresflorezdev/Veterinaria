import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VeterinarianDocument = HydratedDocument<Veterinarian>;

@Schema({ timestamps: true })
export class Veterinarian {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  specialty: string;

  @Prop()
  licenseNumber: string;
}

export const VeterinarianSchema = SchemaFactory.createForClass(Veterinarian);
