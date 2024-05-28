import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie, MovieDocument } from './seed/schemas/movie.schema';
import { Category, CategoryDocument } from './seed/schemas/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { RateMovieDto } from './dtos/get-movie-list.dto';
@Injectable()
export class AppService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async getMovies(input: string): Promise<Movie[]> {
    const movieList = input?.split(',');
    const categories = await this.categoryModel
      .find({ name: { $in: movieList } })
      .exec();
    const categoryIds = categories.map((category) => category._id);
    const movies =
      categoryIds?.length == 0
        ? await this.movieModel.find({}).populate('category').exec()
        : await this.movieModel
            .find({ category: { $in: categoryIds } })
            .populate('category')
            .exec();
    return movies;
  }
  async rateMovie(input: RateMovieDto): Promise<Movie> {
    const { movieId, userId, rating } = input;
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if the user has already rated the movie
    const existingRatingIndex = movie.ratings.findIndex(
      (r) => r.user.toString() === userId,
    );
    if (existingRatingIndex !== -1) {
      // Update existing rating
      movie.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      movie.ratings.push({ user: new ObjectId(userId), rating });
    }

    // Calculate average rating
    const totalRatings = movie.ratings.length;
    const totalRatingSum = movie.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    );
    movie.rating =
      totalRatings > 0 ? (totalRatingSum / totalRatings).toFixed(1) : '0'; // Update the overall movie rating

    // Save the updated movie
    return movie.save();
  }
}
