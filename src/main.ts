import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.FRONTEND_URI,
      credentials: true,
    },
  });
  app.use(cookieParser());
  await app.listen(5000);
}
bootstrap();
