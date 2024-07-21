import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product/product.schema';
import { Manufacturer, ManufacturerSchema } from './manufacturer.schema';
import { Vendor, VendorSchema } from './vendor.schema';

export const schemas = [
  MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Manufacturer.name, schema: ManufacturerSchema },
    { name: Vendor.name, schema: VendorSchema },
  ]),
];

export { Product, Manufacturer, Vendor };
