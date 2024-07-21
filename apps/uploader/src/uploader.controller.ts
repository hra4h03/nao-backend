import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from './uploader.service';

@Controller()
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    // simple solution to get the vendor name from the query
    // in a real-world application, we should have authentication and authorization for this
    @Query('vendor') vendor: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 40 * 1024 * 1024 }), // max 40MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const location = await this.uploaderService.uploadFile(vendor, file);

    return { status: 'uploaded', location };
  }
}
