const { test, expect } = require("../fixtures");

test("Positivo: completar formulario de registro y enviar", async ({
  page,
}) => {
  await page.goto("/auth/register");
  await page.waitForLoadState("networkidle");

  // ASERCIÓN 1: Verificar que el campo sea visible
  const firstNameInput = page.getByTestId("first-name");
  await expect(firstNameInput).toBeVisible();

  // Llenado de datos
  await firstNameInput.fill("Juan");
  // ASERCIÓN 2: Verificar que el texto se escribió correctamente (toHaveValue)
  await expect(firstNameInput).toHaveValue("Juan");

  await page.getByTestId("last-name").fill("Perez");
  await page.getByTestId("dob").fill("1990-01-01");
  await page.getByTestId("street").fill("123 Main St");
  await page.getByTestId("house_number").fill("42");
  await page.getByTestId("postal_code").fill("12345");
  await page.getByTestId("city").fill("Bogota");
  await page.getByTestId("state").fill("Cundinamarca");
  await page.getByTestId("phone").fill("5551234567");
  await page.getByTestId("country").selectOption("US");
  await page
    .locator('xpath=//input[@data-test="email"]')
    .fill(`juan.${Date.now()}@example.com`);
  await page.getByTestId("password").fill("P@ssw0rd_S3gura2026!#");

  // ASERCIÓN 3: Verificar que el botón esté habilitado antes de hacer clic
  const registerBtn = page.getByTestId("register-submit");
  await expect(registerBtn).toBeEnabled();
  await registerBtn.click();

  // ASERCIÓN 4: Verificar que la URL cambió (toHaveURL)
  await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });

  // ASERCIÓN 5: Verificar que el formulario de login ahora es visible
  await expect(page.getByTestId("login-submit")).toBeVisible();
});
