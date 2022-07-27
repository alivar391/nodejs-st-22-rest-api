import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(PORT, () => {
    console.log(`Server is running on port = ${PORT}`);
  });
}
bootstrap();
