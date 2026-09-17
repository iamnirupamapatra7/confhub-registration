"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MIN_GROUP_ATTENDEES } from "@/lib/attendeesSchema";

const TICKET_TYPES = ["standard", "student", "vip"] as const;

export default function AttendeesSection() {
  const t = useTranslations("Registration");
  const { control, setValue, formState: { errors } } = useFormContext();

  const ticketCount = useWatch({ control, name: "ticketCount" }) || {};

  const total = TICKET_TYPES.reduce(
    (sum, type) => sum + (Number(ticketCount[type]) || 0),
    0
  );

  const updateCount = (type: string, delta: number) => {
    const current = Number(ticketCount[type]) || 0;
    const next = Math.max(0, Math.min(50, current + delta));
    const updated = { ...ticketCount, [type]: next };
    // Set the whole `ticketCount` object (not a "ticketCount.standard" dot-path).
    // The group-minimum rule from attendeesSchema.superRefine is attached at
    // the `ticketCount` path itself, so validating a sub-path wouldn't surface it.
    setValue("ticketCount", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // ticketCount errors surface as a root-level message from superRefine
  const ticketError = (errors.ticketCount as { message?: string } | undefined)
    ?.message;

  return (
    <div className="space-y-4">
      {TICKET_TYPES.map((type) => (
        <div
          key={type}
          className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 px-4 py-3"
        >
          <span className="text-sm font-medium">{t(`ticketTypes.${type}`)}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid={`ticket-${type}-minus`}
              onClick={() => updateCount(type, -1)}
              className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600"
              aria-label={`Decrease ${type}`}
            >
              −
            </button>
            <span data-testid={`ticket-${type}-count`} className="w-6 text-center text-sm">
              {ticketCount[type] || 0}
            </span>
            <button
              type="button"
              data-testid={`ticket-${type}-plus`}
              onClick={() => updateCount(type, 1)}
              className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600"
              aria-label={`Increase ${type}`}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2 text-sm font-medium">
        <span>{t("total")}</span>
        <span data-testid="attendee-total">{total}</span>
      </div>

      {ticketError && (
        <p className="text-red-500 text-xs">
          {t("errors.minAttendees", { min: MIN_GROUP_ATTENDEES })}
        </p>
      )}
    </div>
  );
}
