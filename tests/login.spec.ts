import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test.describe("Renderizado del formulario", () => {
    test("debe mostrar todos los campos del login", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      await expect(page.getByPlaceholder("m@example.com")).toBeVisible();
      await expect(page.getByLabel("Contraseña")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Iniciar sesión" }),
      ).toBeVisible();
    });
  });

  test.describe("Validación frontend", () => {
    test("debe mostrar error si el email está vacío al enviar", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.getByLabel("Contraseña").fill("123456");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await expect(page.getByPlaceholder("m@example.com")).toHaveAttribute(
        "required",
      );
    });
  });

  test.describe("Login exitoso E2E", () => {
    test("debe redirigir a /dashboard al iniciar sesión exitosamente", async ({
      page,
    }) => {
      const TEST_EMAIL = "amoiseslinares@gmail.com";

      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("m@example.com").fill(TEST_EMAIL);
      await page.getByLabel("Contraseña").fill("123456");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForURL("**/dashboard", { timeout: 8000 });
    });
  });

  test.describe("Errores del servidor", () => {
    test("debe mostrar error con credenciales inválidas", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("m@example.com").fill("noexiste@test.com");
      await page.getByLabel("Contraseña").fill("wrongpassword");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await expect(
        page.getByText("Invalid login credentials", { exact: false }),
      ).toBeVisible({ timeout: 5000 });
    });
  });
});
