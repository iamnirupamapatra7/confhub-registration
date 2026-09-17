"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { FaSun, FaMoon } from "react-icons/fa";
import { routing, Locale } from "@/i18n/routing";
import { useTheme } from "@/context/ThemeContext";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import RegistrationForm from "@/components/RegistrationForm";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations("Registration");
  const { theme, toggleTheme } = useTheme();

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`border-b ${
          theme === "dark" ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{t("title")}</h1>
          <div className="flex items-center gap-3">
            <LocaleSwitcher currentLocale={locale} />
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-full ${
                theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"
              }`}
            >
              {theme === "light" ? (
                <FaSun data-testid="sun-icon" size={16} />
              ) : (
                <FaMoon data-testid="moon-icon" size={16} />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className={`text-center mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {t("description")}
        </p>
        <div
          className={`rounded-xl p-6 shadow-sm ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <RegistrationForm />
        </div>
      </main>
    </div>
  );
}
