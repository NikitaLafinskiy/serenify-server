import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from 'global.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  console.log('Application started');

  await app.listen(8080, 'serenify');
}
bootstrap();
