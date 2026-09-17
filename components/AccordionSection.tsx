"use client";

import { ReactNode } from "react";

interface AccordionSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  isActive: boolean;
  onToggle: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  theme?: "light" | "dark";
  hasError?: boolean;
}

export default function AccordionSection({
  id,
  title,
  children,
  isActive,
  onToggle,
  isFirst = false,
  isLast = false,
  theme = "light",
  hasError = false,
}: AccordionSectionProps) {
  return (
    <div
      className={`border transition-colors duration-200 ${
        isFirst ? "rounded-t-xl" : ""
      } ${isLast ? "rounded-b-xl" : ""} ${
        theme === "dark"
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
      }`}
    >
      <button
        type="button"
        aria-expanded={isActive}
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 text-left font-medium transition-colors ${
          theme === "dark" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        <span className="flex items-center gap-2">
          {title}
          {hasError && (
            <span
              data-testid={`${id}-error-dot`}
              className="inline-block h-2 w-2 rounded-full bg-red-500"
            />
          )}
        </span>
        <span
          className={`transform transition-transform ${
            isActive ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>
      <div
        data-testid="accordion-content"
        className={isActive ? "block px-5 pb-5" : "hidden"}
      >
        {children}
      </div>
    </div>
  );
}
