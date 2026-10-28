const { test, expect } = require("../fixtures");

test("Positivo: filtrar por categoría Hammer", async ({ page }) => {
  await page.goto("/");

  // 1. Esperamos a que la página cargue por completo
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000); // Damos 2 segundos extra para que Angular dibuje la barra lateral

  // 2. Buscamos la etiqueta (label) que contiene el texto "Hammer"
  // Usamos getByText para encontrar el texto exacto en la barra lateral
  const categoryLabel = page.getByText("Hammer", { exact: true }).first();

  // 3. Esperamos a que sea visible
  await categoryLabel.waitFor({ state: "visible", timeout: 10000 });

  // 4. Hacemos clic en la etiqueta (esto marca el checkbox automáticamente)
  await categoryLabel.click();

  // 5. Esperamos a que la página reaccione y filtre los productos
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // 6. Verificamos que los productos filtrados se muestran en pantalla
  const cards = page.locator(".card");

  // 7. Verificamos que el primer producto sea efectivamente un martillo (que contenga la palabra "Hammer")
  await expect(cards.first()).toContainText("Hammer", { timeout: 10000 });
});
