import { test, expect } from "@playwright/test";

test.describe("Group registration form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/register");
  });

  test("completes a full registration and enforces the minimum group size", async ({
    page,
  }) => {
    await expect(page.getByText("Organizer details")).toBeVisible();

    // --- Contact details ---
    await page.selectOption("#title", "Ms");
    await page.fill("#firstName", "Suriyadevi");
    await page.fill("#lastName", "V");
    await page.fill("#email", "suriyadevi@example.com");
    await page.fill("#phone", "07123456789");
    await page.getByRole("button", { name: "Continue" }).first().click();

    // --- Event preferences ---
    await expect(page.getByText("Event preferences")).toBeVisible();
    await page.selectOption("#organization", "Company");
    await page.getByTestId("companyName").fill("Acme Corp");
    await page.selectOption("#attendancePurpose", "Learning");
    await page.selectOption("#track", "Frontend");
    await page.fill("#startDate", "2026-06-10");
    await page.fill("#endDate", "2026-06-12");
    await page.getByRole("button", { name: "Continue" }).nth(1).click();

    // --- Attendee tickets: try to submit under the group minimum first ---
    await expect(page.getByText("Attendee details")).toBeVisible();
    await page.getByTestId("ticket-standard-plus").click();
    await page.getByTestId("ticket-standard-plus").click();
    await expect(page.getByTestId("attendee-total")).toHaveText("2");

    await page.getByTestId("submit-registration").click();
    await expect(
      page.getByText(/at least 5 attendees/i)
    ).toBeVisible();

    // --- Add enough tickets to clear the group minimum, then submit ---
    for (let i = 0; i < 3; i++) {
      await page.getByTestId("ticket-standard-plus").click();
    }
    await expect(page.getByTestId("attendee-total")).toHaveText("5");

    await page.getByTestId("submit-registration").click();
    await expect(page.getByTestId("success-modal")).toBeVisible();
  });
});
