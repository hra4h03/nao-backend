import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseSchemas } from './database.schemas';
import { schemas } from './schemas';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ...schemas,
  ],
  providers: [DatabaseSchemas],
  exports: [DatabaseSchemas, ...schemas],
})
export class DatabaseModule {}
