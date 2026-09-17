import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales this app supports
  locales: ["en", "es"],

  // Used when no locale matches / no prefix is present
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
