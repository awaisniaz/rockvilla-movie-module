import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Movie } from './seed/schemas/movie.schema';
import { MoviesName, RateMovieDto } from './dtos/get-movie-list.dto';

@ApiTags('Movie')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('get-movies')
  getMovies(@Query() query: MoviesName): Promise<Movie[]> {
    return this.appService.getMovies(query?.moviesname);
  }

  @Patch('/rate-movie')
  rateMovie(@Body() body: RateMovieDto): Promise<Movie> {
    return this.appService.rateMovie(body);
  }
}
