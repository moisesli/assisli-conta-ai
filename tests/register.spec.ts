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
    test("debe redirigir a /confirm al registrarse exitosamente", async ({
      page,
    }) => {
      const TEST_EMAIL = "amoiseslinares@gmail.com";

      await page.goto("/register");
      await page.waitForLoadState("networkidle");
      await page.getByPlaceholder("Nombre (opcional)").fill("Juan");
      await page.getByPlaceholder("Apellido (opcional)").fill("Pérez");
      await page.getByPlaceholder("Email").fill(TEST_EMAIL);
      await page.getByPlaceholder("Contraseña", { exact: true }).fill("123456");
      await page.getByPlaceholder("Confirmar contraseña").fill("123456");
      await page.getByRole("button", { name: "Registrarse" }).click();

      await page.waitForURL("**/confirm", { timeout: 8000 });
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
