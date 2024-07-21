import { StorageService } from '@storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploaderService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFile(vendorName: string, file: Express.Multer.File) {
    const response = await this.storageService.uploadFile(
      vendorName,
      file.originalname,
      file,
    );

    return response.Location;
  }
}
