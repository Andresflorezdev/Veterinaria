import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PetDocument = HydratedDocument<Pet>;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  species: string;

  @Prop()
  breed: string;

  @Prop()
  age: string;

  @Prop({ type: Types.ObjectId, ref: 'Owner', required: true })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Veterinarian', required: true })
  veterinarian: Types.ObjectId;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
