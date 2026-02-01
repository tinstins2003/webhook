import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ErrorHandlerInterceptor } from './common/error-handler.interceptor';
import { AppModule } from './webHooks/app.module';
import * as dotenv from "dotenv";

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ErrorHandlerInterceptor());
  await app.listen(process.env.PORT);
  console.log(`Application is running on port ${await app.getUrl()}`);
}
bootstrap();
