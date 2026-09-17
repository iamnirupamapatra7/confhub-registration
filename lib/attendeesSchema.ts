import { z } from "zod";

export const MIN_GROUP_ATTENDEES = 5;

export const attendeesSchema = z.object({
  ticketCount: z
    .record(
      z.string(),
      z.number().min(0, "Cannot be negative").max(50, "Maximum 50 per ticket type")
    )
    .superRefine((val, ctx) => {
      const total = Object.values(val).reduce(
        (sum: number, count: number) => sum + count,
        0
      );
      if (total < MIN_GROUP_ATTENDEES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "errors.minAttendees",
        });
      }
    }),
});

export type AttendeesFormData = z.infer<typeof attendeesSchema>;
