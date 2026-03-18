import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import type { Movie, PagedResponse } from './movies.types';
import type { TmdbMovie, TmdbPagedResponse, TmdbGenre } from './tmdb.types';

@Injectable()
export class MoviesService {
  private readonly tmdb: AxiosInstance;
  private readonly genreCacheByLanguage = new Map<
    string,
    { expiresAt: number; genres: TmdbGenre[] }
  >();

  constructor() {
    this.tmdb = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      timeout: 10_000,
    });
  }

  private apiKey(): string {
    const key = process.env.TMDB_API_KEY;
    if (!key) {
      throw new ServiceUnavailableException(
        'TMDB_API_KEY is not configured on the server',
      );
    }
    return key;
  }

  private tmdbErrorMessage(err: unknown): string {
    if (!axios.isAxiosError(err)) return 'TMDB request failed';
    const status = err.response?.status;
    if (status) return `TMDB request failed (status ${status})`;
    if (err.code) return `TMDB request failed (${err.code})`;
    return 'TMDB request failed';
  }

  private toMovie(tmdbMovie: TmdbMovie): Movie {
    const releaseYear = tmdbMovie.release_date
      ? new Date(tmdbMovie.release_date).getFullYear()
      : Number.NaN;
    const originalTitleDiffers = tmdbMovie.original_title !== tmdbMovie.title;

    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      ...(originalTitleDiffers
        ? { originalTitle: tmdbMovie.original_title }
        : {}),
      releaseYear: Number.isFinite(releaseYear) ? releaseYear : null,
      rating: tmdbMovie.vote_average,
      image: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : null,
      ...(originalTitleDiffers
        ? { language: tmdbMovie.original_language }
        : {}),
    };
  }

  private toPagedMovies(
    tmdb: TmdbPagedResponse<TmdbMovie>,
  ): PagedResponse<Movie> {
    return {
      page: tmdb.page,
      results: tmdb.results.map((m) => this.toMovie(m)),
      totalPages: tmdb.total_pages,
      totalResults: tmdb.total_results,
    };
  }

  private async getGenres(language = 'en-US'): Promise<TmdbGenre[]> {
    const cacheKey = language;
    const cached = this.genreCacheByLanguage.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiresAt > now) return cached.genres;

    try {
      const { data } = await this.tmdb.get<{ genres: TmdbGenre[] }>(
        '/genre/movie/list',
        {
          params: {
            api_key: this.apiKey(),
            language: cacheKey,
          },
        },
      );
      const genres = data.genres ?? [];
      this.genreCacheByLanguage.set(cacheKey, {
        genres,
        expiresAt: now + 6 * 60 * 60 * 1000,
      });
      return genres;
    } catch (err) {
      throw new ServiceUnavailableException(this.tmdbErrorMessage(err));
    }
  }

  private async resolveGenreId(
    genre: string,
    language: string,
  ): Promise<number> {
    const trimmed = genre.trim();
    if (!trimmed) throw new BadRequestException('genre is required');

    if (/^\d+$/.test(trimmed)) return Number(trimmed);

    const genres = await this.getGenres(language);
    const match = genres.find(
      (g) => g.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!match) {
      throw new BadRequestException(
        `Unknown genre "${trimmed}". Try: action, comedy, drama, horror, ...`,
      );
    }
    return match.id;
  }

  async getPopular(params?: {
    page?: number;
    language?: string;
    originalLanguage?: string;
    genre?: string;
  }): Promise<PagedResponse<Movie>> {
    try {
      const language = params?.language ?? 'en-US';
      const genre = params?.genre?.trim();

      const { data } = genre
        ? await this.tmdb.get<TmdbPagedResponse<TmdbMovie>>('/discover/movie', {
            params: {
              api_key: this.apiKey(),
              page: params?.page,
              language,
              include_adult: false,
              sort_by: 'popularity.desc',
              with_genres: await this.resolveGenreId(genre, language),
            },
          })
        : await this.tmdb.get<TmdbPagedResponse<TmdbMovie>>('/movie/popular', {
            params: {
              api_key: this.apiKey(),
              page: params?.page,
              language,
            },
          });
      const originalLanguage = params?.originalLanguage?.trim();
      const filtered = originalLanguage
        ? {
            ...data,
            results: data.results.filter(
              (m) => m.original_language === originalLanguage,
            ),
          }
        : data;
      return this.toPagedMovies(filtered);
    } catch (err) {
      throw new ServiceUnavailableException(this.tmdbErrorMessage(err));
    }
  }

  async search(params: {
    query: string;
    page?: number;
    language?: string;
    originalLanguage?: string;
  }): Promise<PagedResponse<Movie>> {
    try {
      const { data } = await this.tmdb.get<TmdbPagedResponse<TmdbMovie>>(
        '/search/movie',
        {
          params: {
            api_key: this.apiKey(),
            query: params.query,
            page: params.page,
            language: params.language ?? 'en-US',
            include_adult: false,
          },
        },
      );
      const originalLanguage = params.originalLanguage?.trim();
      const filtered = originalLanguage
        ? {
            ...data,
            results: data.results.filter(
              (m) => m.original_language === originalLanguage,
            ),
          }
        : data;
      return this.toPagedMovies(filtered);
    } catch (err) {
      throw new ServiceUnavailableException(this.tmdbErrorMessage(err));
    }
  }
}
