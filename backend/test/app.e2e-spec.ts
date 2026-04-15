import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
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

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.uptimeSeconds).toBe('number');
        expect(typeof res.body.timestamp).toBe('string');
      });
  });
});
