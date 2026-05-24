import { test, expect } from "@playwright/test";

test.describe("Register flow", () => {
  test.describe("Renderizado del formulario", () => {
    test("debe mostrar todos los campos del registro", async ({ page }) => {
      await page.goto("/register");
      await page.waitForLoadState("networkidle");

      await expect(page.getByPlaceholder("Nombre (opcional)")).toBeVisible();
      await expect(page.getByPlaceholder("Apellido (opcional)")).toBeVisible();
      await expect(page.getByPlaceholder("Email")).toBeVisible();
      await expect(
        page.getByPlaceholder("Contraseña", { exact: true }),
      ).toBeVisible();
      await expect(page.getByPlaceholder("Confirmar contraseña")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Registrarse" }),
      ).toBeVisible();
    });
  });

  test.describe("Validación frontend", () => {
    test("debe mostrar error si las contraseñas no coinciden", async ({
      page,
    }) => {
      await page.goto("/register");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("Email").fill("test@test.com");
      await page.getByPlaceholder("Contraseña", { exact: true }).fill("123456");
      await page.getByPlaceholder("Confirmar contraseña").fill("654321");
      await page.getByRole("button", { name: "Registrarse" }).click();

      await expect(page.getByText("Las contraseñas no coinciden")).toBeVisible({
        timeout: 5000,
      });
    });

    test("debe mostrar error si el email está vacío al enviar", async ({
      page,
    }) => {
      await page.goto("/register");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("Contraseña", { exact: true }).fill("123456");
      await page.getByPlaceholder("Confirmar contraseña").fill("123456");
      await page.getByRole("button", { name: "Registrarse" }).click();

      await expect(page.getByPlaceholder("Email")).toHaveAttribute("required");
    });
  });

  test.describe("Registro exitoso E2E", () => {
    test("debe registrar y llegar a /dashboard", async ({ page }) => {
      const TEST_EMAIL = `e2e_${Date.now()}@test.com`;

      // 1. Registrar nuevo usuario
      await page.goto("/register");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("Nombre (opcional)").fill("Juan");
      await page.getByPlaceholder("Apellido (opcional)").fill("Pérez");
      await page.getByPlaceholder("Email").fill(TEST_EMAIL);
      await page.getByPlaceholder("Contraseña", { exact: true }).fill("123456");
      await page.getByPlaceholder("Confirmar contraseña").fill("123456");
      await page.getByRole("button", { name: "Registrarse" }).click();

      // 2. Redirige a /dashboard (sesión activa)
      await page.waitForURL("**/dashboard", { timeout: 15000 });

      await expect(
        page.getByText("Bienvenido al panel de control"),
      ).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Errores del servidor", () => {
    test("debe mostrar error si el email ya está registrado", async ({
      page,
    }) => {
      await page.goto("/register");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("Email").fill("amoiseslinares@gmail.com");
      await page.getByPlaceholder("Contraseña", { exact: true }).fill("123456");
      await page.getByPlaceholder("Confirmar contraseña").fill("123456");
      await page.getByRole("button", { name: "Registrarse" }).click();

      await expect(
        page.getByText("already registered", { exact: false }),
      ).toBeVisible({ timeout: 5000 });
    });
  });
});
