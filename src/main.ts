import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import config from 'config';
import { AppDataSource } from './database/util/ormconfig';
import nestjsUtils from './util/nestjs';

async function bootstrap() {
  await AppDataSource.initialize();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  nestjsUtils.setCustomSettings(app);
  await app.listen(config.server.port);

  console.log(`Server running at ${config.server.scheme}://${config.server.host}:${config.server.port}/`);
}
bootstrap();
