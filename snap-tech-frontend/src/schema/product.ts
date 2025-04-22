// schemas/product.ts
import { z } from "zod";

export const productSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().min(0, "Stock must be positive"),
    image_url: z.string().url("Invalid URL").optional(),
    category_id: z.number().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;