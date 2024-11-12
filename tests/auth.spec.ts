import { test, expect, Page } from "@playwright/test";
import { login } from "./helpers";

test.describe("/login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("should display the correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Login");
  });

  test("should display an error message for invalid credentials", async ({
    page,
  }) => {
    await login(page, "wronguser@example.com", "wrongpassword");

    const toast = page.getByText("Invalid credentials!");
    await expect(toast).toBeVisible();
  });

  test("should login the user and redirect to /dashboard", async ({ page }) => {
    await login(page, "m.fareeed1997@gmail.com", "1234567");
    // Verify redirection to /dashboard
    await page.waitForURL("/dashboard");
    await expect(page.locator("h2")).toHaveText(
      "Good Evening, Mohamed Fareed 🤩"
    );
  });
});
