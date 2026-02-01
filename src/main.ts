import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

import { ErrorHandlerInterceptor } from './common/error-handler.interceptor';
import { AppModule } from './webHooks/app.module';

dotenv.config();

const BODY_SIZE_LIMIT = process.env.BODY_SIZE_LIMIT ?? '1mb';
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000; // 1 minute
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100; // requests per window

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Body size limit: reject payloads larger than BODY_SIZE_LIMIT
  app.use(json({ limit: BODY_SIZE_LIMIT }));
  app.use(urlencoded({ extended: true, limit: BODY_SIZE_LIMIT }));

  // Rate limit: max RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW_MS
  app.use(
    rateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      max: RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ErrorHandlerInterceptor());
  await app.listen(process.env.PORT);
  console.log(`Application is running on port ${await app.getUrl()}`);
}
bootstrap();
