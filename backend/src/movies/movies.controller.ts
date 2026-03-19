import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // GET /movies/genres
  @Get('genres')
  getGenres(@Query('language') language?: string) {
    return this.moviesService.getMovieGenres({ language });
  }

  // GET /movies
  @Get()
  getMovies(
    @Query('page') page?: string,
    @Query('language') language?: string,
    @Query('original_language') originalLanguage?: string,
    @Query('genre') genre?: string,
  ) {
    const pageNum = page ? Number(page) : undefined;
    return this.moviesService.getPopular({
      page: Number.isFinite(pageNum) ? pageNum : undefined,
      language,
      originalLanguage,
      genre,
    });
  }

  // GET /movies/search?query=batman
  @Get('search')
  searchMovies(
    @Query('query') query: string,
    @Query('page') page?: string,
    @Query('language') language?: string,
    @Query('original_language') originalLanguage?: string,
  ) {
    if (!query?.trim()) {
      throw new BadRequestException('query is required');
    }
    const pageNum = page ? Number(page) : undefined;
    return this.moviesService.search({
      query: query.trim(),
      page: Number.isFinite(pageNum) ? pageNum : undefined,
      language,
      originalLanguage,
    });
  }
}
