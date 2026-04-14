import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRootInfo() {
    return {
      name: 'movie-search-backend',
      version: '0.0.1',
      environment: process.env.NODE_ENV ?? 'development',
      docs: '/docs',
      schema: '/docs-json',
      health: '/health',
      endpoints: {
        movies: '/movies',
        search: '/movies/search?query=batman',
        genres: '/movies/genres',
      },
    };
  }

  getHealth() {
    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
