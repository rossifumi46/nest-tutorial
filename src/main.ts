import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RemovePasswordInterceptor } from './common/interceptors/remove-password.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import rawBodyMiddleware from './common/middlewares/raw-body-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(rawBodyMiddleware());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useGlobalFilters(new HttpExceptionFilter(), new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    // new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
    // new RemovePasswordInterceptor(),
  );
  await app.listen(3002);
}
bootstrap();
