import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule , { cors: true });
  const option = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };
  app.enableCors(option);
 app.use(json({ limit: '100mb' }));

 

 app.use(urlencoded({ extended: true, limit: '50mb' }));
  const options = new DocumentBuilder()
    .setTitle('TC-AUTH-SERVICE')
    .setDescription('SCC')
    .setVersion('1.0')
    .addTag('SCC')
    .addCookieAuth('optional-session-id')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(parseInt(process.env.PORT));
 
}
bootstrap();
