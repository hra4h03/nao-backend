import { DatabaseSchemas } from '@db/database';
import { Manufacturer } from '@db/database/schemas';
import { VendorDocument } from '@db/database/schemas/vendor.schema';
import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StorageService } from '@storage';
import { parse } from 'csv-parse';
import { AnyBulkWriteOperation } from 'mongoose';
import { nanoid } from 'nanoid';
import { BatchTransform } from '../batch/batch.steam';
import { EnhancerService } from '../enhancer/enhancer.service';
import { VendorService } from '../vendor/vendor.service';
import { ProductDTO, ProductsDtoSchema } from './dto/product-csv.dto';

@Injectable()
export class ProcessorService {
  private readonly logger = new Logger(ProcessorService.name);

  constructor(
    private readonly schemas: DatabaseSchemas,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly vendorService: VendorService,
    private readonly enhancerService: EnhancerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async processLargeCSV() {
    this.logger.debug('Processing large CSV file');

    // here I have hardcoded the vendor name, but in a real-world scenario,
    // we would have a list of vendors to process
    const file = await this.storageService.getFileForVendor('naologic');
    if (!file) {
      return this.logger.warn('No files found');
    }

    const [, vendorName, fileName] = file.Key.split('/');
    const vendor = await this.vendorService.getVendor(vendorName);
    const stream = this.storageService.downloadFile(vendorName, fileName);

    const parser = parse({
      delimiter: '\t',
      columns: true,
      trim: true,
      quote: null,
      escape: null,
      relaxColumnCount: true,
      skipEmptyLines: true,
    });

    const batchSize = this.configService.get<number>('BATCH_SIZE');
    const batchTransform = new BatchTransform({
      batchSize,
      highWaterMark: 1, // process one batch at a time due to memory constraints
      objectMode: true,
    });

    await new Promise((resolve, reject) => {
      let currentBatchNumber = 0;
      stream
        .pipe(parser)
        .pipe(batchTransform)
        .on('data', async (batch) => {
          // pause the stream to process the batch, to avoid backpressure
          batchTransform.pause();

          try {
            this.logger.debug(`Processing batch ${currentBatchNumber++}`);
            await this.processBatch(vendor, batch);
            this.logger.debug(
              `Batch ${currentBatchNumber} finished processing`,
            );
          } catch (error) {
            reject({ status: 'error', error });
          }

          batchTransform.resume();
        })
        .on('end', () => {
          this.logger.debug(`Finished processing`);
          resolve({ status: 'complete' });
        })
        .on('error', (error) => {
          this.logger.error('Error processing batch', error);
          reject({ status: 'error', error });
        });
    });

    const count = this.configService.get<number>('ENHANCE_PRODUCT_COUNT');
    if (count) {
      await this.processProductEnhancements(count);
    }
  }

  private async processBatch(vendor: VendorDocument, batch: ProductDTO[]) {
    ProductsDtoSchema.parse(batch);

    await this.processManufacturers(batch);
    await this.processProducts(vendor, batch);
  }

  private async processManufacturers(products: ProductDTO[]) {
    const bulkOps: AnyBulkWriteOperation<Manufacturer>[] = products.map(
      (doc) => ({
        updateOne: {
          filter: { id: doc.ManufacturerID },
          update: {
            $set: {
              code: doc.ManufacturerCode,
              name: doc.ManufacturerName,
              id: doc.ManufacturerID,
            },
          },
          upsert: true,
        },
      }),
    );

    await this.schemas.Manufacturer.bulkWrite(bulkOps);
  }

  private async processProducts(
    vendor: VendorDocument,
    products: ProductDTO[],
  ) {
    const bulkOps = products.map((productData) => ({
      updateOne: {
        filter: { productId: productData.ProductID },
        update: {
          $setOnInsert: {
            name: productData.ProductName,
            type: 'non-inventory',
            shortDescription: productData.ItemDescription,
            description: productData.ProductDescription,
            vendorId: vendor._id,
            productId: productData.ProductID,
            storefrontPriceVisibility: 'members-only',
            availability:
              productData.QuantityOnHand > 0 ? 'available' : 'out_of_stock',
            isFragile: false,
            published: true,
            isTaxable: true,
            images: [
              {
                fileName: productData.ImageFileName,
                cdnLink: productData.ItemImageURL,
                i: 0,
                alt: productData.ProductName,
              },
            ],
            categoryId: productData.CategoryID,
            category: productData.CategoryName,
          },
          $addToSet: {
            variants: {
              id: nanoid(),
              available: productData.QuantityOnHand > 0,
              attributes: {
                packaging: productData.PKG,
                description: productData.ItemDescription,
              },
              cost: faker.number.float({ min: 1, max: 1000 }),
              currency: faker.finance.currencyCode(),
              depth: faker.number.int({ min: 1, max: 10 }),
              description: productData.ItemDescription,
              dimensionUom: 'in',
              height: faker.number.int({ min: 1, max: 10 }),
              width: faker.number.int({ min: 1, max: 10 }),
              manufacturerItemCode: productData.ManufacturerItemCode,
              manufacturerItemId: productData.ItemID,
              packaging: productData.PKG,
              price: productData.UnitPrice,
              volume: faker.number.int({ min: 1, max: 10 }),
              volumeUom: 'in3',
              weight: faker.number.int({ min: 1, max: 10 }),
              weightUom: 'lb',
              optionName: `${productData.PKG}, ${productData.ItemDescription}`,
              sku: faker.number.int({ min: 100000, max: 999999 }).toString(),
              active: true,
              images: [
                {
                  fileName: productData.ImageFileName,
                  cdnLink: productData.ItemImageURL,
                  i: 0,
                  alt: productData.ProductName,
                },
              ],
              itemCode: productData.ManufacturerItemCode,
            },
          },
        },
        upsert: true,
      },
    }));

    await this.schemas.Product.bulkWrite(bulkOps);
  }

  private async processProductEnhancements(count: number) {
    this.logger.debug(`Enhancing ${count} products' descriptions`);
    const products = await this.schemas.Product.find({}, null, {
      limit: count,
    });

    for (const product of products) {
      const enhancedDescription =
        await this.enhancerService.enhanceProductDescription({
          productName: product.name,
          description: product.description,
          category: product.categoryId,
        });

      await this.schemas.Product.updateOne(
        { _id: product._id },
        { description: enhancedDescription },
      );
    }
  }
}
