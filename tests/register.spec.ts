import { test, expect } from '@playwright/test'

test.describe('Register flow', () => {
  test('debe mostrar el formulario de registro', async ({ page }) => {
    await page.goto('/register')

    // Verificar que los campos del form existen
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('debe mostrar error con email inválido', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="email"]', 'email-invalido')
    await page.fill('input[name="password"]', '123456')
    await page.click('button[type="submit"]')

    // Verificar que se muestra algún error de validación
    await expect(page.locator('text=email')).toBeVisible()
  })
})
