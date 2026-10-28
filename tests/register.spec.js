// tests/register.spec.js
const { test, expect } = require("../fixtures");

test.describe("Registro de nuevo usuario", () => {
  test("Positivo: completar formulario de registro y enviar", async ({
    page,
  }) => {
    await page.goto("https://practicesoftwaretesting.com/#/auth/register");
    await page.waitForLoadState("networkidle");

    // ===== Uso de Localizadores =====
    // 1. getByRole para validar el título
    await expect(
      page.getByRole("heading", { name: "Customer registration" }),
    ).toBeVisible();

    // 2. locator() con CSS para obtener todos los inputs
    const allInputs = page.locator("input.form-control");
    const inputCount = await allInputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(7); // Validamos que existan los campos necesarios

    // 3. first(): El primer input es "First name"
    await allInputs.first().fill("Juan");
    await expect(allInputs.first()).toHaveValue("Juan");

    // 4. nth(): Seleccionar por índice
    await allInputs.nth(1).fill("Perez"); // Last name
    await allInputs.nth(2).fill("1990-01-01"); // Date of birth

    // 5. last(): El último input suele ser "Password"
    await allInputs.last().fill("SecurePass123!");

    // 6. filter(): Filtrar inputs por texto o etiqueta
    await page.getByLabel("Postal code").fill("12345");
    await page.getByLabel("City").fill("Bogota");
    await page.getByLabel("State").fill("Cundinamarca");

    // 7. XPath traversal: following-sibling::* y ..
    //    Ubicamos el label de "Email", bajamos al input y luego subimos al contenedor
    const emailLabel = page.locator('xpath=//label[normalize-space()="Email"]');
    await expect(emailLabel).toBeVisible();
    const emailInput = page.locator(
      'xpath=//label[normalize-space()="Email"]/following-sibling::*//input',
    );
    await emailInput.fill(`juan.perez.${Date.now()}@example.com`);

    // xpath=.. : sube al elemento padre del input
    const emailInputParent = emailInput.locator("xpath=..");
    await expect(emailInputParent).toBeVisible();

    // xpath=preceding-sibling::* : ubica el hermano anterior
    const phoneInput = page.locator(
      'xpath=//label[normalize-space()="Phone"]/following-sibling::*//input',
    );
    await phoneInput.fill("5551234567");
    const previousSiblingOfPhone = phoneInput.locator(
      "xpath=preceding-sibling::*",
    );
    await expect(previousSiblingOfPhone.first()).toBeVisible();

    // ===== Envío y Aserciones =====
    const registerBtn = page.getByRole("button", { name: "Register" });
    await expect(registerBtn).toBeEnabled();
    await registerBtn.click();

    // Aserciones finales: redirección y mensaje de éxito
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });
    await expect(page.getByText("Registration completed")).toBeVisible();
  });
});
