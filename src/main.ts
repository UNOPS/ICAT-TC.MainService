import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';


async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 app.use(json({ limit: '50mb' }));
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
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // });
  app.use(helmet());
  // app.enableCors();
  // app.use(helmet.contentSecurityPolicy({
  //   // useDefaults: false,
  //   directives: {
  //     defaultSrc: ["http://13.127.171.33/erp"],
  //     scriptSrc: [ "http://13.127.171.33/erp"],
     
  //     upgradeInsecureRequests: [],
  //   },
  //   // reportOnly: true,
  // }));
  app.enableCors({
    "origin": ["http://localhost:4200","http://3.108.9.184:4200","http://3.108.9.184:7100","http://3.108.9.184:7000","http://3.108.9.184:7090"],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  });
  await app.listen(7080);
 
}
bootstrap();
