"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

export default function EventPreferencesSection({
  onNext,
}: {
  onNext: () => void;
}) {
  const t = useTranslations("Registration");
  const {
    register,
    trigger,
    control,
    formState: { errors },
  } = useFormContext();

  const organization = useWatch({ control, name: "organization" });

  const handleContinue = async () => {
    const fields = [
      "organization",
      "attendancePurpose",
      "track",
      "startDate",
      "endDate",
    ];
    if (organization === "Company") fields.push("companyName");
    const valid = await trigger(fields as never);
    if (valid) onNext();
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="organization" className="block text-sm font-medium mb-1">
          {t("fields.organization")} *
        </label>
        <select
          id="organization"
          data-testid="organization"
          className={inputClass}
          {...register("organization")}
        >
          <option value="">--</option>
          {t.raw("options.organizationTypes").map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.organization && (
          <p className="text-red-500 text-xs mt-1">{t(`${errors.organization.message}` as never)}</p>
        )}
      </div>

      {organization === "Company" && (
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium mb-1">
            {t("fields.companyName")} *
          </label>
          <input
            id="companyName"
            data-testid="companyName"
            className={inputClass}
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">{t(`${errors.companyName.message}` as never)}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="attendancePurpose" className="block text-sm font-medium mb-1">
          {t("fields.attendancePurpose")} *
        </label>
        <select
          id="attendancePurpose"
          className={inputClass}
          {...register("attendancePurpose")}
        >
          <option value="">--</option>
          {t.raw("options.purposes").map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.attendancePurpose && (
          <p className="text-red-500 text-xs mt-1">
            {t(`${errors.attendancePurpose.message}` as never)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="track" className="block text-sm font-medium mb-1">
          {t("fields.track")} *
        </label>
        <select id="track" className={inputClass} {...register("track")}>
          <option value="">--</option>
          {t.raw("options.tracks").map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.track && (
          <p className="text-red-500 text-xs mt-1">{t(`${errors.track.message}` as never)}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            {t("fields.startDate")} *
          </label>
          <input
            id="startDate"
            type="date"
            className={inputClass}
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{t(`${errors.startDate.message}` as never)}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">
            {t("fields.endDate")} *
          </label>
          <input id="endDate" type="date" className={inputClass} {...register("endDate")} />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{t(`${errors.endDate.message}` as never)}</p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleContinue}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
