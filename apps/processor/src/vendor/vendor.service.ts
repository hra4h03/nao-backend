import { DatabaseSchemas } from '@db/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorService {
  constructor(private readonly schemas: DatabaseSchemas) {}

  async getVendor(vendorName: string) {
    const vendor = await this.schemas.Vendor.findOneAndUpdate(
      { name: vendorName },
      { name: vendorName },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
    return vendor;
  }
}
