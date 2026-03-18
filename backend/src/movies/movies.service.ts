import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import type { TmdbMovie, TmdbPagedResponse } from './tmdb.types';

type TmdbGenre = { id: number; name: string };

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
    } catch {
      throw new ServiceUnavailableException('TMDB request failed');
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
  }): Promise<TmdbPagedResponse<TmdbMovie>> {
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
      if (!originalLanguage) return data;
      return {
        ...data,
        results: data.results.filter(
          (m) => m.original_language === originalLanguage,
        ),
      };
    } catch {
      throw new ServiceUnavailableException('TMDB request failed');
    }
  }

  async search(params: {
    query: string;
    page?: number;
    language?: string;
    originalLanguage?: string;
  }): Promise<TmdbPagedResponse<TmdbMovie>> {
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
      if (!originalLanguage) return data;
      return {
        ...data,
        results: data.results.filter(
          (m) => m.original_language === originalLanguage,
        ),
      };
    } catch {
      throw new ServiceUnavailableException('TMDB request failed');
    }
  }
}
