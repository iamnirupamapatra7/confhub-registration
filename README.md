# ConfHub — Group Workshop Registration

A multi-step group registration form for a fictional developer conference, built to demonstrate a production-style Next.js frontend: typed schema validation, internationalization, theming, and a three-layer automated test suite.

## 🌍 Overview

This app lets an organizer register a group of attendees for a conference in three steps, with a real business rule enforced across the whole group (not just one field): **group registration requires at least 5 total attendees across ticket types.**

### 🧾 Form sections

1. **Organizer details** — name, title, email, phone
2. **Event preferences** — organization type (with a conditional company-name field), purpose, track, and check-in/check-out dates (with an end-after-start cross-field rule)
3. **Attendee details** — ticket counts per type (Standard / Student / VIP), enforcing the 5-attendee group minimum

All required fields are validated as you go; the first accordion section with an error is flagged with a red dot and opens automatically if you try to submit with invalid data.

## 🌐 Internationalization

- Locale switcher in the header
- Supports **English (`en`)** and **Spanish (`es`)** via `next-intl`, with locale-prefixed routes:
  - `/en/register`
  - `/es/register`
- Adding a third locale means adding one `messages/<locale>.json` file and one entry in `i18n/routing.ts` — no component changes required.

## 🎨 Theme toggle

Light/dark theme via React Context (`context/ThemeContext.tsx`), toggled from the header. Kept in memory for this demo — see *Future improvements* for persisting it.

## ✅ Form validation

- `react-hook-form` + `zod` via `@hookform/resolvers`, validated live (`mode: "onChange"`)
- Cross-field rules via `.refine()` / `.superRefine()`, not just per-field checks:
  - Company name is required only when "Company" is selected as the organization type
  - End date must be after the start date
  - Total attendees across all ticket types must be at least 5

## 📥 Form submission

Submits to `/api/submit`, which appends the registration to `mock-data/registrations.json` on disk.

> ⚠️ **Note:** this works in local dev, but Vercel's serverless filesystem is read-only in production — submissions won't persist on the deployed demo. A real deployment would swap this for Supabase, Firebase, or another database.

## 🚀 Tech stack

| Area | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Forms | React Hook Form + Zod |
| Internationalization | next-intl |
| Unit/component testing | Jest, React Testing Library |
| E2E testing | Playwright |
| Component explorer | Storybook |
| Linting | ESLint (`eslint-config-next`) |

## 🚀 Setup & run instructions

```bash
git clone <repository-url>
cd confhub-registration
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) (it redirects to `/en/register`).

## 📦 Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Run the local dev server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests with Jest |
| `npm run test:coverage` | Run unit tests with a coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:report` | Open the last Playwright HTML report |
| `npm run test:all` | Run unit + E2E tests |
| `npm run storybook` | Start Storybook at `localhost:6006` |
| `npm run build-storybook` | Build Storybook for production |

## 🧪 Testing

- **Unit/component tests** (`components/__tests__/`) — Jest + React Testing Library. `AttendeesSection.test.tsx` exercises the group-minimum business rule through a real `react-hook-form` + `zodResolver` integration (not mocked), including a case that actually caught a real bug during development — see *What I'd do differently* below.
- **E2E test** (`tests/registration.spec.ts`) — Playwright drives a full happy-path registration: fills all three sections, attempts to submit under the group minimum (asserts the error shows), adds enough tickets to clear it, and asserts the success screen appears.

Run `npm run test:coverage` for a full coverage report.

## 🪝 Pre-commit hook

Husky + `lint-staged` run ESLint (with `--max-warnings=0`) on staged `.ts`/`.tsx` files before every commit — a commit with a lint error or warning is rejected. This runs automatically once you `npm install` (via the `prepare` script), no extra setup needed.

## 🛠️ CI/CD

Two GitHub Actions workflows in `.github/workflows/`:
- `ci.yml` — lint + unit tests on every push/PR to `main`
- `playwright.yml` — installs Chromium and runs the full E2E suite, uploading the HTML report as an artifact

## 🔮 Future improvements

- Persist theme preference (`localStorage` or a cookie) instead of resetting on reload
- Swap the mock filesystem API for a real backend (Supabase/Firebase) so submissions survive a Vercel deploy
- Add a real-time progress indicator across the three form sections
- Server-side re-validation of the submitted payload in `/api/submit` (currently client-validated only)
- Add reCAPTCHA/hCaptcha before submission
- Lighthouse performance/accessibility audit once deployed

## 🧠 What I'd do differently / lessons learned

While building the attendee-counter component, the increment/decrement buttons updated a nested `ticketCount.<type>` path with `setValue(..., { shouldValidate: true })`. A Jest test (not manual clicking) caught that the group-minimum validation error never appeared — because the Zod `superRefine` rule is attached to the whole `ticketCount` object, but validating a dot-path sub-field doesn't re-surface a parent-level error in react-hook-form. Fixed by validating the whole `ticketCount` object on every change instead of a sub-path. This is a good example of why testing the actual validation behavior (not just "does the button increment the number") matters.

## 📄 License

MIT — see [LICENSE](./LICENSE).
