import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { StorageModule } from '@storage';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StorageModule,
  ],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
