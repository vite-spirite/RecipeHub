import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';

const env = dotenv.config().parsed;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Recipe Hub')
    .setDescription('Collab recipe app API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  await app.listen(3000);
}
bootstrap();
