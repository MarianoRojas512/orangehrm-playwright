# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

End-to-end Playwright test suite for [OrangeHRM Live](https://opensource-demo.orangehrmlive.com) — an open-source HR management demo app. Tests are written in TypeScript using the Page Object Model pattern.

## Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run tests in a specific file
npx playwright test tests/e2e/auth/login.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "login"

# Run only smoke tests
npx playwright test tests/smoke/

# Run with headed browser (visible)
npx playwright test --headed

# Run in UI mode (interactive)
npx playwright test --ui

# Open last HTML report
npx playwright show-report
```

## Architecture

### Page Object Model

All page interactions are encapsulated in `pages/`. Every page class extends `BasePage` (`pages/BasePage.ts`), which provides shared helpers (`navigate`, `click`, `fill`, `waitForPageLoad`) that wait for visibility and network idle before acting.

Page classes are organized by module, mirroring the OrangeHRM nav structure:
- `pages/LoginPage.ts`, `pages/DashboardPage.ts` — top-level pages
- `pages/leave/LeaveListPage.ts` — Leave module
- `pages/pim/EmployeeListPage.ts` — PIM (People Information Management) module
- `pages/recruitment/VacanciesPage.ts` — Recruitment module

### Tests

Tests live in `tests/` split by type:
- `tests/e2e/` — full user flows, organized by module (`auth/`, `leave/`, `pim/`, `recruitment/`)
- `tests/smoke/` — lightweight sanity checks

### Supporting layers

- `fixtures/fixtures.ts` — custom Playwright fixtures (extend `test` here to inject page objects)
- `utils/apiHelpers.ts` — direct API calls for test setup/teardown (bypassing UI where possible)
- `utils/testData.ts` — test data factories/helpers
- `test-data/users.json` — static user credential data

### Path aliases

`tsconfig.json` defines aliases so imports use `@pages/`, `@utils/`, `@fixtures/` instead of relative paths.

## Configuration

`playwright.config.ts` targets Chromium only. `baseURL` is set to the live demo site — tests hit a shared public instance, so data created by tests persists briefly and can conflict across parallel runs. CI runs with `workers: 1` and 2 retries; locally workers default to auto.

The Playwright MCP server is configured in `.mcp.json` for use with Claude Code's browser tools.

---

## Workflow Rules

- **Never make any file change without explicit user approval first.** Always present what you plan to do and wait for the user's OK before executing. This applies to every edit, creation, or deletion — no exceptions.

---

## Senior SDET Rules & Best Practices

These rules are mandatory. They reflect Playwright's official guidance and production-grade automation standards. Follow them exactly when writing or modifying any test or page object code.

### Locators

- **Prefer user-facing locators** in this order: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`. Fall back to CSS only when no semantic locator exists.
- **Never use XPath.** It couples tests to DOM structure and breaks on minor UI changes.
- **Never select by index** (`nth(0)`) unless the position is semantically meaningful and stable.
- **Define locators as `readonly` class properties**, initialized in the constructor — this is the established pattern in this project and matches Playwright's official docs:
  ```ts
  readonly usernameInput: Locator;
  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
  }
  ```
- **Never pass raw selector strings** into test files. All locators live in page objects.

### Waiting Strategy

- **Never use `page.waitForTimeout()`** or `sleep`. It is always a sign of a flaky workaround.
- **Never rely solely on `waitForLoadState('networkidle')`** in SPAs like OrangeHRM. It is unreliable with polling requests. Wait for a specific, meaningful element after navigation instead:
  ```ts
  await this.page.waitForLoadState('domcontentloaded');
  await this.someHeadingLocator.waitFor({ state: 'visible' });
  ```
- **Use web-first assertions** (`toBeVisible`, `toHaveText`, `toBeEnabled`) — they auto-retry up to the configured `actionTimeout`. Avoid manual `waitFor` when an assertion covers the same condition.

### Assertions

- **Always import `expect` from `@playwright/test`**, never from Node's `assert`.
- **Use web-first assertions exclusively**: `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveValue()`, `toBeEnabled()`, etc.
- **One logical concept per assertion.** Don't chain unrelated assertions in a single `expect` call.
- **Use `expect.soft()`** for non-blocking checks (e.g. verifying multiple fields on a read-only view) so the test continues and surfaces all failures at once.
- **Every test must have at least one `expect` call** that verifies the outcome, not just that an action didn't throw.

### `BasePage` Helpers

- **`isEnabled()` must be awaited.** The current `BasePage` calls `locator.isEnabled()` without `await`, discarding the Promise. Fix the signature or use `expect(locator).toBeEnabled()` before acting.
- Extend `BasePage` helpers only for behavior needed across **three or more** page objects. Don't add one-off helpers to the base class.
- `waitForPageLoad` wrapping `networkidle` is acceptable as a last resort but should not be the primary synchronisation mechanism in new code.

### Page Object Model

- **One class per page/component.** If a page has a modal or a sidebar that appears across pages, extract it into its own component class.
- **Page objects expose behaviour, not implementation.** Method names should read like user actions: `searchEmployee()`, `submitLeaveRequest()`, not `clickSearchButton()`.
- **No assertions in page objects.** Assertions belong in tests. Page objects return data or `this` for chaining.
- **No `test` or `expect` imports in page files.** Page objects are plain classes that depend only on `Page` and `Locator`.

### Test Design

- **Each test must be fully independent.** No test may depend on state left by a previous test. Use `beforeEach`/`afterEach` or fixtures for setup and teardown.
- **Prefer API setup over UI setup.** Use `utils/apiHelpers.ts` to create preconditions (employees, leave requests, vacancies) instead of navigating through the UI, making tests faster and less brittle.
- **Authenticate via `storageState`**, not by logging in during every test. The `setup` project in `playwright.config.ts` handles auth; tests in `chromium` project inherit the saved state automatically. Only `*.noauth.spec.ts` files should perform a login flow.
- **Tag tests** with Playwright's `tag` option for filtering:
  ```ts
  test('login with valid credentials', { tag: '@smoke' }, async ({ page }) => { ... });
  ```
  Standard tags: `@smoke`, `@regression`, `@critical`.
- **Use `test.step()`** to group logical phases in longer flows. This improves trace readability and HTML report output:
  ```ts
  await test.step('Fill employee form', async () => { ... });
  await test.step('Verify employee appears in list', async () => { ... });
  ```
- **Test names must describe behaviour, not implementation.** Use the pattern `should <outcome> when <condition>` or a plain user-story sentence:
  - Good: `'displays validation error when username is empty'`
  - Bad: `'test login form'`

### Data Management

- **Never hardcode credentials or IDs** in test files. Use `test-data/users.json` or environment variables via `process.env`.
- **Test data must be cleaned up.** Any entity created via UI or API during a test must be deleted in `afterEach`/`afterAll` using the API helpers.
- **Use factories in `utils/testData.ts`** to generate unique data per run (e.g. append `Date.now()` or a UUID to names) to avoid collisions on the shared demo instance.

### Fixtures

- **Register all page objects as fixtures** in `fixtures/fixtures.ts`. Tests should receive page objects via fixture injection, not by instantiating them with `new` inside the test body.
- **Fixtures handle their own teardown.** Use the `{ scope: 'test' }` default; only use `'worker'` scope for resources that are genuinely expensive to recreate (e.g. authenticated storage state).

### Configuration & CI

- **`forbidOnly: !!process.env.CI`** is set — never commit `test.only()` or `describe.only()`.
- **`retries: 2` in CI is a safety net, not a fix.** A test that passes only on retry is flaky and must be investigated and fixed.
- **`trace: 'on-first-retry'`** and **`video: 'on-first-retry'`** are configured. Always attach the trace archive when reporting a failing test — it contains network, console, and DOM snapshots.
- **`screenshot: 'only-on-failure'`** is set. Do not add manual `page.screenshot()` calls for debugging; remove them before committing.

### Code Quality

- **No `// TODO` or `// FIXME` comments committed to main.** Open a ticket instead.
- **No `console.log` in test or page object files.** Use `test.info().annotations` or Playwright's built-in logging.
- **TypeScript strict mode is assumed.** All new code must be type-safe; avoid `any`.
- **Imports must use path aliases** (`@pages/`, `@utils/`, `@fixtures/`) — never relative `../../` paths.