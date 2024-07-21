import { NestFactory } from '@nestjs/core';
import { ProcessorModule } from './processor/processor.module';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProcessorService } from 'apps/processor/src/processor/processor.service';

async function bootstrap() {
  const app = await NestFactory.create(ProcessorModule);

  // comment out the following line if you want to run the processor
  // without scheduling the task

  // await app.get(ProcessorService).processLargeCSV();

  await app.listen(5000);
}
bootstrap();
