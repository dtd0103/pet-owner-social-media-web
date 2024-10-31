import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
  console.log(join(__dirname, '..', 'uploads'));

  const config = new DocumentBuilder()
    .setTitle('Petiverse Social Media API')
    .setDescription('The Pet Owner Social Media API description')
    .setVersion('1.0')
    .addTag('Thesis')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
