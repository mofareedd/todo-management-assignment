import { test, expect } from "@playwright/test";
import { login } from "./helpers";
import { randomUUID } from "node:crypto";
import { db } from "@/server/db";
import { tasksTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const email = "m.fareeed1997@gmail.com";
const password = "1234567";
const NEW_TASK = randomUUID();

test.describe("/dashboard Page", () => {
  test("should redirect non-authenticated user to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/auth/login");
  });

  test("should display dashboard content for authenticated user", async ({
    page,
  }) => {
    // Simulate user login by filling the form
    await page.goto("/login");
    await login(page, email, password);
    // Verify dashboard content
    await page.waitForURL("/dashboard");
    await expect(page.locator("h2")).toHaveText(
      "Good Evening, Mohamed Fareed 🤩"
    );
  });
});

test.describe("Create Todo", () => {
  test.afterAll(async () => {
    await db.delete(tasksTable).where(eq(tasksTable.name, NEW_TASK));
  });
  test("should create a new task successfully", async ({ page }) => {
    await page.goto("/auth/login");
    await login(page, email, password);
    await page.waitForURL("/dashboard");

    // Click the button to open the Create Todo dialog
    await page.getByTestId("create-todo").click();

    // Check if the dialog is open
    await expect(page.getByText(/create new task/i)).toBeVisible();

    // Fill the task input
    const taskInput = page.getByPlaceholder("Enter your task");
    await taskInput.fill(NEW_TASK);

    // Click the Save Changes button
    const saveButton = page.getByRole("button", { name: /Create Task/i });
    await saveButton.click();

    await expect(page.getByText(NEW_TASK)).toBeVisible();
  });
});

test.describe("Delete Todo", () => {
  test("should delete a todo item successfully", async ({ page }) => {
    // Perform login using the helper function
    await login(page, email, password);

    // Click the button to open the Create Todo dialog
    await page.getByTestId("create-todo").click();

    await page.getByPlaceholder("Enter your task").fill(NEW_TASK);

    // Click the Save Changes button
    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByText(NEW_TASK)).not.toBeVisible();
  });
});
