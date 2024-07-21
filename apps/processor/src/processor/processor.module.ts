import { DatabaseModule } from '@db/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '@storage';
import { EnhancerModule } from '../enhancer/enhancer.module';
import { VendorModule } from '../vendor/vendor.module';
import { ProcessorService } from './processor.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    StorageModule,
    VendorModule,
    EnhancerModule,
  ],
  providers: [ProcessorService],
})
export class ProcessorModule {}
