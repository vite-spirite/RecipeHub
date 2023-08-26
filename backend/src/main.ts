import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import {json, urlencoded} from 'body-parser'

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
  
  app.use(json({limit: '50mb'}));
  app.use(urlencoded({limit: '50mb', extended: true}));

  app.enableCors({
    origin: ['http://recipeshub.localhost', 'http://frontend:8080', 'http://app:3000'], // L'URL de votre application frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Si votre application utilise des cookies ou des sessions
  });

  app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  await app.listen(3000);
}
bootstrap();
