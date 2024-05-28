// src/categories/schemas/Movie.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from './category.schema';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  rating: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop([
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
    },
  ])
  ratings: { user: mongoose.Types.ObjectId; rating: number }[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
