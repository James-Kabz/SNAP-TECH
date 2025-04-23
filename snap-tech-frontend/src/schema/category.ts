import { z } from "zod";

export const categorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;