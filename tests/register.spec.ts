import { test, expect } from '@playwright/test'

const AUTH_URL = '**/auth/v1/signup'

test.describe('Register flow', () => {
  test.describe('Renderizado del formulario', () => {
    test('debe mostrar todos los campos del registro', async ({ page }) => {
      await page.goto('/register')
      await page.waitForLoadState('networkidle')

      await expect(page.getByPlaceholder('Nombre (opcional)')).toBeVisible()
      await expect(page.getByPlaceholder('Apellido (opcional)')).toBeVisible()
      await expect(page.getByPlaceholder('Email')).toBeVisible()
      await expect(page.getByPlaceholder('Contraseña', { exact: true })).toBeVisible()
      await expect(page.getByPlaceholder('Confirmar contraseña')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible()
    })
  })

  test.describe('Validación frontend', () => {
    test('debe mostrar error si las contraseñas no coinciden', async ({ page }) => {
      const messages: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') messages.push(msg.text())
      })

      await page.goto('/register')
      await page.waitForLoadState('networkidle')
      await page.getByPlaceholder('Email').fill('test@test.com')
      await page.getByPlaceholder('Contraseña', { exact: true }).fill('123456')
      await page.getByPlaceholder('Confirmar contraseña').fill('654321')
      await page.getByRole('button', { name: 'Registrarse' }).click()
      await page.waitForTimeout(500)

      await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible({ timeout: 5000 })
      expect(messages.length).toBe(0)
    })

    test('debe mostrar error si el email está vacío al enviar', async ({ page }) => {
      await page.goto('/register')
      await page.waitForLoadState('networkidle')
      await page.getByPlaceholder('Contraseña', { exact: true }).fill('123456')
      await page.getByPlaceholder('Confirmar contraseña').fill('123456')
      await page.getByRole('button', { name: 'Registrarse' }).click()

      // El navegador muestra el tooltip de validación required
      await expect(page.getByPlaceholder('Email')).toHaveAttribute('required')
    })
  })

  test.describe('Registro exitoso', () => {
    test('debe redirigir a /confirm al registrarse exitosamente', async ({ page }) => {
      const messages: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') messages.push(msg.text())
      })

      await page.route(AUTH_URL, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'user-123',
            email: 'test@test.com',
            user_metadata: { first_name: 'Juan', last_name: 'Pérez' },
          }),
        })
      })

      await page.goto('/register')
      await page.waitForLoadState('networkidle')
      await page.getByPlaceholder('Nombre (opcional)').fill('Juan')
      await page.getByPlaceholder('Apellido (opcional)').fill('Pérez')
      await page.getByPlaceholder('Email').fill('test@test.com')
      await page.getByPlaceholder('Contraseña', { exact: true }).fill('123456')
      await page.getByPlaceholder('Confirmar contraseña').fill('123456')
      await page.getByRole('button', { name: 'Registrarse' }).click()

      // Esperar que navegue a /confirm o que se muestre el error
      await page.waitForURL('**/confirm', { timeout: 5000 })
      expect(messages.length).toBe(0)
    })
  })

  test.describe('Errores del servidor', () => {
    test('debe mostrar error si el email ya está registrado', async ({ page }) => {
      await page.route(AUTH_URL, async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'User already registered',
            message: 'El usuario ya existe',
          }),
        })
      })

      await page.goto('/register')
      await page.waitForLoadState('networkidle')
      await page.getByPlaceholder('Email').fill('existente@test.com')
      await page.getByPlaceholder('Contraseña', { exact: true }).fill('123456')
      await page.getByPlaceholder('Confirmar contraseña').fill('123456')
      await page.getByRole('button', { name: 'Registrarse' }).click()
      await page.waitForTimeout(500)

      await expect(page.getByText('usuario ya existe')).toBeVisible({ timeout: 5000 })
    })

    test('debe mostrar error genérico si el servidor falla', async ({ page }) => {
      await page.route(AUTH_URL, async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' }),
        })
      })

      await page.goto('/register')
      await page.waitForLoadState('networkidle')
      await page.getByPlaceholder('Email').fill('test@test.com')
      await page.getByPlaceholder('Contraseña', { exact: true }).fill('123456')
      await page.getByPlaceholder('Confirmar contraseña').fill('123456')
      await page.getByRole('button', { name: 'Registrarse' }).click()
      await page.waitForTimeout(500)

      await expect(page.getByText('error', { exact: false })).toBeVisible({ timeout: 5000 })
    })
  })
})
