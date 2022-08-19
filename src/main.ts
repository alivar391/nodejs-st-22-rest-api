import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(PORT, () => {
    console.log(`Server is running on port = ${PORT}`);
  });

  process.on('uncaughtException', (error, origin) => {
    console.error(`captured error: ${error.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise) => {
    console.error(`Unhandled rejection detected: ${reason}`);
  });
}
bootstrap();
