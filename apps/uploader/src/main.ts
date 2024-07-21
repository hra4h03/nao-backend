import { NestFactory } from '@nestjs/core';
import { UploaderModule } from './uploader.module';

async function bootstrap() {
  const app = await NestFactory.create(UploaderModule);
  await app.listen(3000);
}
bootstrap();
