import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AuthGuard } from './decorators/auth.decorator';
import { ResponseInterceptor } from './interceptors/response.interceptor';

const setCustomSettings = async (app: NestExpressApplication) => {
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useStaticAssets(join(__dirname, 'util/email/assets'), {
    prefix: '/email/assets',
  });

  // app.enableCors(); // Uncomment this line to enable CORS
};

export default { setCustomSettings };
