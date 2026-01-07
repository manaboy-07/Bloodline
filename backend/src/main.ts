import { NestFactory } from '@nestjs/core';

import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('Bloodline');
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
