import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class MoviesName {
  @ApiProperty()
  @Expose()
  @IsString()
  moviesname: string;
}

export class RateMovieDto {
  @ApiProperty()
  @Expose()
  @IsString()
  movieId: string;

  @ApiProperty()
  @Expose()
  @IsString()
  userId: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  rating: number;
}
