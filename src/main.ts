import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as nocache from 'nocache';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.use(helmet());
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       useDefaults: false,
  //       directives: {
  //         'default-src': 'none',
  //       },
  //     },
  //   }),
  // );
  // app.use(nocache());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log('[WEB]', `${config.get<string>('BASE_URL')}:${port}`);
  });
}
bootstrap();
