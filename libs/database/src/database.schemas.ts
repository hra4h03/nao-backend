import { Manufacturer, Product, Vendor } from '@db/database/schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseSchemas {
  constructor(
    @InjectModel(Vendor.name)
    public readonly Vendor: Model<Vendor>,
    @InjectModel(Product.name)
    public readonly Product: Model<Product>,
    @InjectModel(Manufacturer.name)
    public readonly Manufacturer: Model<Manufacturer>,
  ) {}
}
