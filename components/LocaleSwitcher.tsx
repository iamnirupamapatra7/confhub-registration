"use client";

import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (nextLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
  };

  return (
    <select
      aria-label="Select language"
      value={currentLocale}
      onChange={(e) => handleChange(e.target.value)}
      className="text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-2 py-1"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
