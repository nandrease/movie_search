import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API root information', () => {
      expect(appController.getRootInfo()).toEqual({
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
      });
    });
  });
});
