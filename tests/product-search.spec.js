// tests/product-search.spec.js
const { test, expect } = require("../fixtures");

test.describe("Búsqueda de productos", () => {
  // Positivo: Búsqueda y filtrado
  test('Positivo: buscar "Pliers" y verificar resultados', async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/#/");
    await page.waitForLoadState("networkidle");

    // Uso de getByPlaceholder (visto en el PDF)
    const searchBox = page.getByPlaceholder("Search");
    await searchBox.fill("Pliers");
    await searchBox.press("Enter");
    await page.waitForLoadState("networkidle");

    // Uso de filter() para encontrar tarjetas que contengan "Pliers"
    const productCards = page.locator(".card").filter({ hasText: "Pliers" });
    await expect(productCards.first()).toBeVisible();

    // first() / nth() / last()
    const firstCard = productCards.first();
    const secondCard = productCards.nth(1);
    const lastCard = productCards.last();

    await expect(firstCard).toBeVisible();
    if ((await secondCard.count()) > 0) await expect(secondCard).toBeVisible();
    await expect(lastCard).toBeVisible();

    // XPath: following-sibling::* desde el título hacia el precio
    const firstTitle = firstCard.getByRole("heading").first();
    await expect(firstTitle).toBeVisible();
    const siblingAfterTitle = firstTitle.locator("xpath=following-sibling::*");
    await expect(siblingAfterTitle.first()).toBeVisible();

    // Aserción de conteo
    expect(await productCards.count()).toBeGreaterThan(0);
  });

  // Positivo: Filtrado por marca
  test('Positivo: filtrar por marca "ForgeFlex Tools"', async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/#/");
    await page.waitForLoadState("networkidle");

    const brandCheckbox = page.getByRole("checkbox", {
      name: "ForgeFlex Tools",
    });
    await brandCheckbox.check();
    await page.waitForLoadState("networkidle");

    const cards = page.locator(".card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Verificamos que el primer resultado contenga la marca
    await expect(cards.first()).toContainText("ForgeFlex Tools");
  });

  // Negativo: Búsqueda sin resultados
  test("Negativo: buscar producto inexistente → sin resultados", async ({
    page,
  }) => {
    await page.goto("https://practicesoftwaretesting.com/#/");
    await page.waitForLoadState("networkidle");

    const searchBox = page.getByPlaceholder("Search");
    await searchBox.fill("XYZ_NO_EXISTE_999");
    await searchBox.press("Enter");
    await page.waitForLoadState("networkidle");

    const productCards = page.locator(".card");
    const count = await productCards.count();

    if (count === 0) {
      await expect(page.getByText(/no results|not found/i)).toBeVisible();
    } else {
      await expect(
        productCards.filter({ hasText: "XYZ_NO_EXISTE_999" }),
      ).toHaveCount(0);
    }
  });

  // Negativo + Mock de Red: Simular fallo 500 en la API de búsqueda
  test("Negativo: error 500 en API de búsqueda", async ({ page }) => {
    // Interceptar y modificar la respuesta de la red
    await page.route("**/products/search**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("https://practicesoftwaretesting.com/#/");
    await page.waitForLoadState("networkidle");

    const searchBox = page.getByPlaceholder("Search");
    await searchBox.fill("Pliers");
    await searchBox.press("Enter");
    await page.waitForLoadState("networkidle");

    // Aserción: La página no debe colapsar
    await expect(page.locator("body")).toBeVisible();
    const cardCount = await page.locator(".card").count();

    if (cardCount === 0) {
      const errorOrEmpty = page
        .locator('.alert, .no-results, [role="alert"]')
        .first();
      await expect(errorOrEmpty).toBeVisible();
    } else {
      console.warn(
        "La API falló, pero se muestran tarjetas cacheadas o predefinidas.",
      );
    }
  });
});
