const { test, expect } = require("../fixtures");

test.describe("Inicio de sesión", () => {
  test("Positivo: iniciar sesión con credenciales válidas", async ({
    page,
  }) => {
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");

    const emailInput = page.getByTestId("email");
    const passwordInput = page.getByTestId("password");

    // ASERCIÓN 1: Verificar que los campos sean visibles
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    await emailInput.fill("customer@practicesoftwaretesting.com");
    await passwordInput.fill("welcome01");

    // ASERCIÓN 2: Verificar que el correo se escribió bien
    await expect(emailInput).toHaveValue(
      "customer@practicesoftwaretesting.com",
    );

    await page.getByTestId("login-submit").click();

    // ASERCIÓN 3: Verificar la URL de destino
    await expect(page).toHaveURL(/.*account/, { timeout: 10000 });

    // ASERCIÓN 4: Verificar que un elemento de la cuenta esté visible
    await expect(page.getByText("My account")).toBeVisible();
  });

  test("Negativo: contraseña incorrecta → error 401 simulado", async ({
    page,
  }) => {
    await page.route("**/users/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Invalid credentials" }),
      });
    });

    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("email").fill("incorrecto@example.com");
    await page.getByTestId("password").fill("clave_incorrecta");
    await page.getByTestId("login-submit").click();

    const errorAlert = page.locator(".alert-danger, [role='alert']").first();

    // ASERCIÓN 1: Verificar que la alerta sea visible
    await expect(errorAlert).toBeVisible();

    // ASERCIÓN 2: Verificar que contenga el texto del error (toContainText)
    await expect(errorAlert).toContainText("Invalid credentials");

    // ASERCIÓN 3: Verificar que NO nos movimos de la página de login
    await expect(page).toHaveURL(/.*auth\/login/);
  });
});
