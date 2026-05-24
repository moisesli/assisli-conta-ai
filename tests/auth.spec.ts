import { test, expect } from "@playwright/test";

const TEST_EMAIL = "amoiseslinares@gmail.com";
const TEST_PASSWORD = "123456";

test.describe("Auth protection (middleware)", () => {
  test.describe("Rutas protegidas sin sesión", () => {
    test("CA1: /dashboard sin sesión redirige a /login", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe("Rutas protegidas con sesión activa", () => {
    test("CA2: /dashboard con sesión muestra el dashboard", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("m@example.com").fill(TEST_EMAIL);
      await page.getByLabel("Contraseña").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForURL("**/dashboard", { timeout: 15000 });

      await expect(
        page.getByText("Bienvenido al panel de control"),
      ).toBeVisible({ timeout: 5000 });
    });

    test("CA3: /login con sesión redirige a /dashboard", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("m@example.com").fill(TEST_EMAIL);
      await page.getByLabel("Contraseña").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Iniciar sesión" }).click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });

      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("CA4: /register con sesión redirige a /dashboard", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("m@example.com").fill(TEST_EMAIL);
      await page.getByLabel("Contraseña").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Iniciar sesión" }).click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });

      await page.goto("/register");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});
