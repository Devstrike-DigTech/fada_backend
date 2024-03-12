import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { PORT } from './Helpers/Config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder, ApiBody } from '@nestjs/swagger';
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.set('trust proxy', 1);
  app.useStaticAssets(join(__dirname, 'public'));
  // somewhere in your initialization file
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Fada Docs')
    .setDescription('API Documentation of Fada Project')
    .setVersion('1.0')
    // .addTag('fada')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
}
bootstrap();
