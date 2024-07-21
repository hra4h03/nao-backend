import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { DatabaseModule } from '@db/database';

@Module({
  imports: [DatabaseModule],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
