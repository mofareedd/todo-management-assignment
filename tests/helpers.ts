import { Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}
