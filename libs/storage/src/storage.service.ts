import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3;
  private readonly bucketName: string;
  private readonly prefix: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3({
      region: 'eu-central-1',
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
    this.prefix = 'vendor_products/';
  }

  listFiles(): Promise<S3.ListObjectsV2Output> {
    this.logger.log('Listing files from S3');

    return this.client
      .listObjectsV2({
        Bucket: this.bucketName,
        Prefix: this.prefix,
        StartAfter: this.prefix,
      })
      .promise();
  }

  async getFileForVendor(vendorName: string): Promise<S3.Object> {
    this.logger.debug('Listing files from S3');

    const files = await this.client
      .listObjectsV2({
        Bucket: this.bucketName,
        MaxKeys: 1,
        Prefix: `${this.prefix}${vendorName}/`,
        StartAfter: `${this.prefix}${vendorName}/`,
      })
      .promise();

    return files['Contents'][0];
  }

  downloadFile(vendorName: string, fileName: string): Readable {
    this.logger.debug('Creating read stream from S3');

    const s3Stream = this.client
      .getObject({
        Bucket: this.bucketName,
        Key: `${this.prefix}${vendorName}/${fileName}`,
      })
      .createReadStream();

    return s3Stream;
  }

  uploadFile(
    vendorName: string,
    fileName: string,
    file: Express.Multer.File,
  ): Promise<S3.ManagedUpload.SendData> {
    this.logger.debug('Uploading file to S3');

    return this.client
      .upload({
        Bucket: this.bucketName,
        Key: `${this.prefix}${vendorName}/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
  }
}
