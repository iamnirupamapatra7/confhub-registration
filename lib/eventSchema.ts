import { z } from "zod";

// Kept as a plain ZodObject (no .refine here) so it stays mergeable with
// the other section schemas. The end-after-start cross-field check lives
// in the combined schema in lib/index.ts, alongside the other form-wide rules.
export const eventSchema = z.object({
  organization: z.string().min(1, "errors.organization"),
  companyName: z.string().max(100).optional(),
  attendancePurpose: z.string().min(1, "errors.attendancePurpose"),
  track: z.string().min(1, "errors.track"),
  startDate: z.string().min(1, "errors.startDate"),
  endDate: z.string().min(1, "errors.endDate"),
});

export type EventFormData = z.infer<typeof eventSchema>;
