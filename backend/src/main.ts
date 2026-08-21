import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('Bloodline');
  app.enableCors({
    origin: ['https://bloodline-frontend.vercel.app', 'http://localhost:4000'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
