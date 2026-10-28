// tests/login.spec.js
const { test, expect } = require("../fixtures");

test.describe("Inicio de sesión", () => {
  // Positivo: Inicio de sesión con credenciales válidas
  test("Positivo: iniciar sesión con credenciales válidas", async ({
    page,
  }) => {
    await page.goto("https://practicesoftwaretesting.com/#/auth/login");
    await page.waitForLoadState("networkidle");

    const emailInput = page.getByLabel("Email address");
    const passwordInput = page.getByLabel("Password");

    // XPath: following-sibling::* desde la etiqueta hacia el input
    const emailLabel = page.locator(
      'xpath=//label[normalize-space()="Email address"]',
    );
    await expect(emailLabel).toBeVisible();
    const emailViaXpath = page.locator(
      'xpath=//label[normalize-space()="Email address"]/following-sibling::*//input',
    );
    await expect(emailViaXpath).toBeVisible();

    await emailInput.fill("customer@practicesoftwaretesting.com");
    await passwordInput.fill("welcome01");
    await page.getByRole("button", { name: "Login" }).click();

    // Aserciones: URL de cuenta y elementos visibles
    await expect(page).toHaveURL(/.*account/, { timeout: 10000 });
    await expect(page.getByText("My account")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  });

  // Negativo: Credenciales incorrectas + Mock de Red (401)
  test("Negativo: contraseña incorrecta → error 401 simulado", async ({
    page,
  }) => {
    // Interceptar la petición de login y forzar un error 401
    await page.route("**/users/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Invalid credentials" }),
      });
    });

    await page.goto("https://practicesoftwaretesting.com/#/auth/login");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Email address").fill("incorrecto@example.com");
    await page.getByLabel("Password").fill("clave_incorrecta");
    await page.getByRole("button", { name: "Login" }).click();

    // Aserciones: se mantiene en login y muestra la alerta
    await expect(page).toHaveURL(/.*auth\/login/);
    const errorAlert = page.locator('.alert-danger, [role="alert"]').first();
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText("Invalid credentials");
  });

  // Negativo: Validación de campos vacíos
  test("Negativo: campos vacíos → validación del frontend", async ({
    page,
  }) => {
    await page.goto("https://practicesoftwaretesting.com/#/auth/login");
    await page.waitForLoadState("networkidle");

    const loginBtn = page.getByRole("button", { name: "Login" });

    // Si el botón está habilitado, al hacer clic deben aparecer errores.
    // Si está deshabilitado por defecto, evaluamos ese estado.
    const isEnabled = await loginBtn.isEnabled();
    if (isEnabled) {
      await loginBtn.click();
      await expect(
        page.locator(".invalid-feedback, .alert-danger").first(),
      ).toBeVisible();
    } else {
      await expect(loginBtn).toBeDisabled();
    }
  });
});
