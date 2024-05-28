import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';
import { RatingModule } from './rating/rating.module';
import { Movie, MovieSchema } from './seed/schemas/movie.schema';
import { Category, CategorySchema } from './seed/schemas/category.schema';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    // eslint-disable-next-line prettier/prettier
    MongooseModule.forRoot(process.env.DATABASE_URL),
    SeedModule,
    RatingModule,
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Category?.name, schema: CategorySchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
