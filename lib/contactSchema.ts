import { z } from "zod";

export const contactSchema = z.object({
  title: z.string().min(1, "errors.title"),
  firstName: z.string().min(1, "errors.firstName").max(50),
  lastName: z.string().min(1, "errors.lastName").max(50),
  email: z.string().email("errors.email").max(100),
  phone: z
    .string()
    .min(7, "errors.phone")
    .max(15, "errors.phone")
    .regex(/^[0-9+\s-]+$/, "errors.phone"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
