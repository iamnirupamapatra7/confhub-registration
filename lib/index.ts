import { z } from "zod";
import { contactSchema } from "./contactSchema";
import { eventSchema } from "./eventSchema";
import { attendeesSchema } from "./attendeesSchema";

export const formSchema = contactSchema
  .merge(eventSchema)
  .merge(attendeesSchema)
  .refine(
    (data) => {
      // Company name is only required when registering as a company
      if (data.organization === "Company" && !data.companyName?.trim()) {
        return false;
      }
      return true;
    },
    { message: "errors.companyName", path: ["companyName"] }
  )
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    { message: "errors.endBeforeStart", path: ["endDate"] }
  );

export type FormData = z.infer<typeof formSchema>;

