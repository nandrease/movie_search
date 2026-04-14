import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Movie Search API')
    .setDescription('Nest backend for TMDB movie search and popular listings')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`)
    .build();

  const openApiDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, openApiDocument, {
    jsonDocumentUrl: 'docs-json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
