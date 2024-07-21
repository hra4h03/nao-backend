import { Module } from '@nestjs/common';
import { EnhancerService } from './enhancer.service';

@Module({
  providers: [EnhancerService],
  exports: [EnhancerService],
})
export class EnhancerModule {}
