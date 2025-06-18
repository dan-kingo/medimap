import { z } from 'zod';

export const searchMedicinesQuerySchema = z.object({
  query: z.string().optional(),

  latitude: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    }, { message: 'Latitude must be a number between -90 and 90' }),

  longitude: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    }, { message: 'Longitude must be a number between -180 and 180' }),

  delivery: z
    .string()
    .optional()
    .refine(val => val === 'true' || val === 'false', { message: 'Delivery must be "true" or "false"' }),

  sort: z.enum(['price_asc', 'price_desc']).optional(),
});

export const medicineDetailsParamsSchema = z.object({
  id: z.string().length(24, 'Invalid medicine ID length').regex(/^[0-9a-fA-F]{24}$/, 'Invalid medicine ID format'),
});
