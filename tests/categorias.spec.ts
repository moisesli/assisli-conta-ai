import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const TEST_EMAIL = "amoiseslinares@gmail.com";
const TEST_PASSWORD = "123456";

function uniqueCategoryName(prefix: string) {
  return `${prefix} ${Date.now()}`;
}

async function login(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByPlaceholder("m@example.com").fill(TEST_EMAIL);
  await page.getByLabel("Contraseña").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}

test.describe("Categorias", () => {
  test("muestra la lista real de categorías del usuario autenticado", async ({
    page,
  }) => {
    await login(page);

    await page.goto("/dashboard/categorias");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Categorías" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /nueva categoría/i }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("crea una categoría nueva desde un modal de shadcn", async ({
    page,
  }) => {
    const categoryName = uniqueCategoryName("Categoria e2e");

    await login(page);
    await page.goto("/dashboard/categorias");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /nueva categoría/i }).click();
    await expect(
      page.getByRole("dialog", { name: /crear categoría/i }),
    ).toBeVisible();

    await page.getByLabel(/nombre/i).fill(categoryName);
    await page
      .getByLabel(/descripción/i)
      .fill("Categoria creada por Playwright");
    await page.getByLabel(/tipo de ciclo/i).selectOption("mensual");
    await page.getByRole("button", { name: /guardar/i }).click();

    await expect(
      page.getByRole("dialog", { name: /crear categoría/i }),
    ).toBeHidden();
    await expect(page.getByText(categoryName)).toBeVisible();
  });

  test("edita una categoría existente desde un modal", async ({ page }) => {
    const originalName = uniqueCategoryName("Categoria editar");
    const updatedName = uniqueCategoryName("Categoria editada");

    await login(page);
    await page.goto("/dashboard/categorias");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /nueva categoría/i }).click();
    await page.getByLabel(/nombre/i).fill(originalName);
    await page.getByLabel(/tipo de ciclo/i).selectOption("mensual");
    await page.getByRole("button", { name: /guardar/i }).click();
    await expect(page.getByText(originalName)).toBeVisible();

    const row = page.getByRole("row", { name: new RegExp(originalName, "i") });
    await row.getByRole("button", { name: /acciones/i }).click();
    await row.getByRole("button", { name: /^Editar$/ }).click();
    await expect(
      page.getByRole("dialog", { name: /editar categoría/i }),
    ).toBeVisible();

    await page.getByLabel(/nombre/i).fill(updatedName);
    await page.getByRole("button", { name: /actualizar/i }).click();

    await expect(
      page.getByRole("dialog", { name: /editar categoría/i }),
    ).toBeHidden();
    await expect(page.getByText(updatedName)).toBeVisible();
  });

  test("elimina una categoría usando el dialog de confirmación", async ({
    page,
  }) => {
    const categoryName = uniqueCategoryName("Categoria borrar");

    await login(page);
    await page.goto("/dashboard/categorias");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /nueva categoría/i }).click();
    await page.getByLabel(/nombre/i).fill(categoryName);
    await page.getByLabel(/tipo de ciclo/i).selectOption("mensual");
    await page.getByRole("button", { name: /guardar/i }).click();
    await expect(page.getByText(categoryName)).toBeVisible();

    const row = page.getByRole("row", { name: new RegExp(categoryName, "i") });
    await row.getByRole("button", { name: /acciones/i }).click();
    await row.getByRole("button", { name: /^Eliminar$/ }).click();
    await expect(
      page.getByRole("dialog", { name: /eliminar categoría/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /confirmar eliminación/i }).click();

    await expect(
      page.getByRole("dialog", { name: /eliminar categoría/i }),
    ).toBeHidden();
    await expect(page.getByText(categoryName)).toHaveCount(0);
  });

  test("busca categorías por nombre desde el input (server-side)", async ({
    page,
  }) => {
    const searchName = uniqueCategoryName("Busqueda test");

    await login(page);
    await page.goto("/dashboard/categorias");
    await page.waitForLoadState("networkidle");

    // Crear categoría para buscar
    await page.getByRole("button", { name: /nueva categoría/i }).click();
    await page.getByLabel(/nombre/i).fill(searchName);
    await page.getByLabel(/tipo de ciclo/i).selectOption("mensual");
    await page.getByRole("button", { name: /guardar/i }).click();
    await expect(page.getByText(searchName)).toBeVisible();

    // Buscar por nombre
    await page.getByPlaceholder(/buscar por nombre/i).fill(searchName);
    await page.waitForTimeout(500);
    await expect(page.getByText(searchName)).toBeVisible();

    // Buscar algo inexistente
    await page
      .getByPlaceholder(/buscar por nombre/i)
      .fill("ZZZZ_NO_EXISTE_999");
    await page.waitForTimeout(500);
    await expect(page.getByText(/todavía no tienes categorías/i)).toBeVisible();
  });

  test("la paginación muestra controles navegables cuando hay suficientes categorías", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/dashboard/categorias");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Categorías" }),
    ).toBeVisible();

    const anteriorBtn = page.locator("button:has-text('Anterior')");
    const siguienteBtn = page.locator("button:has-text('Siguiente')");

    // Si hay paginación, navegar una página
    const siguienteCount = await siguienteBtn.count();
    if (siguienteCount > 0) {
      await siguienteBtn.click();
      await page.waitForTimeout(500);
      await expect(anteriorBtn).not.toBeDisabled();
    }
  });
});
