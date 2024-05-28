// src/seed/seed.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { MovieCategory } from './constants/categories.enum';
import { movieslist } from './MoviesData/movies-data';

interface Movies {
  title: string;
  category: MovieCategory | string;
  rating: string;
}
@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  async seedCategories() {
    console.log('🚀🚀🚀 Movies Seeding is running');
    const movies: Movies[] = movieslist;
    for (let item = 0; item < movies?.length; item++) {
      const currentItem = movies[item];
      const category = await this.categoryModel
        .findOne({ name: currentItem?.category })
        .exec();
      if (category) {
        movies[item] = { ...currentItem, category: category?._id?.toString() };
      }
    }
    const existingCategories = await this.movieModel.find().exec();
    if (existingCategories.length === 0) {
      return this.movieModel.insertMany(movies);
    } else {
      console.log('Movies already seeded');
      return 'Movies already seeded';
    }
  }
}
