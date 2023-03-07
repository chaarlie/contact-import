import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [String(process.env.CLIENT_HOST_URL)],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
