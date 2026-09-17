"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

export default function ContactDetailsSection({
  onNext,
}: {
  onNext: () => void;
}) {
  const t = useTranslations("Registration");
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const handleContinue = async () => {
    const valid = await trigger(["title", "firstName", "lastName", "email", "phone"]);
    if (valid) onNext();
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          {t("fields.title")} *
        </label>
        <select id="title" data-testid="title" className={inputClass} {...register("title")}>
          <option value="">--</option>
          {t.raw("options.titles").map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{t(`${errors.title.message}` as never)}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            {t("fields.firstName")} *
          </label>
          <input id="firstName" className={inputClass} {...register("firstName")} />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{t(`${errors.firstName.message}` as never)}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            {t("fields.lastName")} *
          </label>
          <input id="lastName" className={inputClass} {...register("lastName")} />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{t(`${errors.lastName.message}` as never)}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {t("fields.email")} *
        </label>
        <input id="email" type="email" className={inputClass} {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{t(`${errors.email.message}` as never)}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          {t("fields.phone")} *
        </label>
        <input id="phone" className={inputClass} {...register("phone")} />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{t(`${errors.phone.message}` as never)}</p>
        )}
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
