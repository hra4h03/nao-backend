import { z } from 'zod';

export const ProductDtoSchema = z.object({
  SiteSource: z.string(),
  ItemID: z.string(),
  ManufacturerID: z.string(),
  ManufacturerCode: z.string(),
  ManufacturerName: z.string(),
  ProductID: z.string(),
  ProductName: z.string(),
  ProductDescription: z.string(),
  ManufacturerItemCode: z.string(),
  ItemDescription: z.string(),
  ImageFileName: z.string(),
  ItemImageURL: z.string(),
  NDCItemCode: z.string(),
  PKG: z.string(),
  UnitPrice: z.string().transform((val) => parseFloat(val)),
  QuantityOnHand: z.string().transform((val) => parseInt(val, 10)),
  PriceDescription: z.string(),
  Availability: z.string(),
  PrimaryCategoryID: z.string(),
  PrimaryCategoryName: z.string(),
  SecondaryCategoryID: z.string(),
  SecondaryCategoryName: z.string(),
  CategoryID: z.string(),
  CategoryName: z.string(),
  IsRX: z
    .string()
    .optional()
    .transform((val) => val === 'Y'),
  IsTBD: z
    .string()
    .optional()
    .transform((val) => val === 'Y'),
});

export const ProductsDtoSchema = z.array(ProductDtoSchema);

export type ProductDTO = z.infer<typeof ProductDtoSchema>;
