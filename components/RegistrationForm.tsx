"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { formSchema, FormData } from "@/lib";
import { useTheme } from "@/context/ThemeContext";
import AccordionSection from "./AccordionSection";
import ContactDetailsSection from "./ContactDetailsSection";
import EventPreferencesSection from "./EventPreferencesSection";
import AttendeesSection from "./AttendeesSection";

const FIELD_TO_SECTION: Record<string, string> = {
  title: "contact",
  firstName: "contact",
  lastName: "contact",
  email: "contact",
  phone: "contact",
  organization: "event",
  companyName: "event",
  attendancePurpose: "event",
  track: "event",
  startDate: "event",
  endDate: "event",
  ticketCount: "attendees",
};

export default function RegistrationForm() {
  const t = useTranslations("Registration");
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>("contact");
  const [showSuccess, setShowSuccess] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      companyName: "",
      attendancePurpose: "",
      track: "",
      startDate: "",
      endDate: "",
      ticketCount: { standard: 0, student: 0, vip: 0 },
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onValid = async (data: FormData) => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowSuccess(true);
        methods.reset();
      } else {
        console.error("Submission failed:", response.status);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // Jump to whichever section holds the first invalid field, like the
  // reference project's scroll-and-focus behavior. This runs from
  // react-hook-form's own invalid-submit callback rather than an effect
  // watching `errors`, so it only fires on an actual submit attempt.
  const onInvalid = (formErrors: typeof errors) => {
    const firstErrorKey = Object.keys(formErrors)[0];
    const section = firstErrorKey ? FIELD_TO_SECTION[firstErrorKey] : undefined;
    if (section) setActiveSection(section);
  };

  const wrappedSubmit = handleSubmit(onValid, onInvalid);

  const hasSectionError = (fields: string[]) =>
    fields.some((f) => Boolean((errors as Record<string, unknown>)[f]));

  if (showSuccess) {
    return (
      <div className="text-center py-10" data-testid="success-modal">
        <h2 className="text-xl font-semibold mb-2">{t("successTitle")}</h2>
        <p className="text-sm text-gray-500 mb-4">{t("successBody")}</p>
        <button
          onClick={() => setShowSuccess(false)}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm text-white"
        >
          {t("close")}
        </button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        role="form"
        onSubmit={wrappedSubmit}
        className="space-y-4 max-w-3xl mx-auto"
      >
        <AccordionSection
          id="contact"
          title={t("contactTitle")}
          isFirst
          isActive={activeSection === "contact"}
          onToggle={() =>
            setActiveSection(activeSection === "contact" ? null : "contact")
          }
          theme={theme}
          hasError={hasSectionError(["title", "firstName", "lastName", "email", "phone"])}
        >
          <ContactDetailsSection onNext={() => setActiveSection("event")} />
        </AccordionSection>

        <AccordionSection
          id="event"
          title={t("eventTitle")}
          isActive={activeSection === "event"}
          onToggle={() =>
            setActiveSection(activeSection === "event" ? null : "event")
          }
          theme={theme}
          hasError={hasSectionError([
            "organization",
            "companyName",
            "attendancePurpose",
            "track",
            "startDate",
            "endDate",
          ])}
        >
          <EventPreferencesSection onNext={() => setActiveSection("attendees")} />
        </AccordionSection>

        <AccordionSection
          id="attendees"
          title={t("attendeesTitle")}
          isLast
          isActive={activeSection === "attendees"}
          onToggle={() =>
            setActiveSection(activeSection === "attendees" ? null : "attendees")
          }
          theme={theme}
          hasError={hasSectionError(["ticketCount"])}
        >
          <AttendeesSection />
        </AccordionSection>

        <div className="pt-2">
          <button
            type="submit"
            data-testid="submit-registration"
            className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          >
            {t("submit")}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
