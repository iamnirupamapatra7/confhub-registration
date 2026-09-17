import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AttendeesSection from "../AttendeesSection";
import { attendeesSchema, AttendeesFormData } from "@/lib/attendeesSchema";

// Mirrors the reference project's approach: mock next-intl's translation hook
// directly rather than fighting Jest's CJS/ESM interop for the real package.
jest.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string, vars?: Record<string, unknown>) => {
      const strings: Record<string, string> = {
        "ticketTypes.standard": "Standard",
        "ticketTypes.student": "Student",
        "ticketTypes.vip": "VIP",
        total: "Total attendees",
        "errors.minAttendees": `Group registration needs at least ${
          vars?.min ?? 5
        } attendees in total`,
      };
      return strings[key] ?? key;
    };
    return t;
  },
}));

function Wrapper() {
  const methods = useForm<AttendeesFormData>({
    resolver: zodResolver(attendeesSchema),
    mode: "onChange",
    defaultValues: { ticketCount: { standard: 0, student: 0, vip: 0 } },
  });

  return (
    <FormProvider {...methods}>
      <AttendeesSection />
    </FormProvider>
  );
}

describe("AttendeesSection", () => {
  it("starts every ticket type at zero", () => {
    render(<Wrapper />);
    expect(screen.getByTestId("ticket-standard-count")).toHaveTextContent("0");
    expect(screen.getByTestId("ticket-student-count")).toHaveTextContent("0");
    expect(screen.getByTestId("ticket-vip-count")).toHaveTextContent("0");
    expect(screen.getByTestId("attendee-total")).toHaveTextContent("0");
  });

  it("increments and decrements a ticket type", () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByTestId("ticket-standard-plus"));
    fireEvent.click(screen.getByTestId("ticket-standard-plus"));
    expect(screen.getByTestId("ticket-standard-count")).toHaveTextContent("2");

    fireEvent.click(screen.getByTestId("ticket-standard-minus"));
    expect(screen.getByTestId("ticket-standard-count")).toHaveTextContent("1");
  });

  it("never goes below zero", () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByTestId("ticket-vip-minus"));
    expect(screen.getByTestId("ticket-vip-count")).toHaveTextContent("0");
  });

  it("sums all ticket types into the total", () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByTestId("ticket-standard-plus"));
    fireEvent.click(screen.getByTestId("ticket-standard-plus"));
    fireEvent.click(screen.getByTestId("ticket-student-plus"));
    expect(screen.getByTestId("attendee-total")).toHaveTextContent("3");
  });

  it("shows the minimum-attendees error below the group threshold", async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByTestId("ticket-standard-plus"));

    await waitFor(() => {
      expect(
        screen.getByText(/Group registration needs at least 5 attendees/i)
      ).toBeInTheDocument();
    });
  });

  it("clears the minimum-attendees error once the group threshold is met", async () => {
    render(<Wrapper />);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByTestId("ticket-standard-plus"));
    }

    await waitFor(() => {
      expect(
        screen.queryByText(/Group registration needs at least 5 attendees/i)
      ).not.toBeInTheDocument();
    });
  });
});
