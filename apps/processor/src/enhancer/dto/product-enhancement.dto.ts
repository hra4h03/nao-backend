import { z } from 'zod';

export const ProductEnhancementInputSchema = z.object({
  productName: z.string(),
  description: z.string(),
  category: z.string(),
});

export type ProductEnhancementInput = z.infer<
  typeof ProductEnhancementInputSchema
>;
