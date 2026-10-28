const { test, expect } = require("../fixtures");

test.describe("Pruebas usando Fixtures", () => {
  // Este test usa el TEST FIXTURE (loggedInPage)
  // Nota cómo no tenemos que escribir el código de login aquí. Playwright ya lo hizo.
  test("Verificar acceso a la cuenta usando el Test Fixture", async ({
    loggedInPage,
  }) => {
    // loggedInPage es la página, pero ya está autenticada
    await loggedInPage.goto("/account"); // O la ruta de perfil

    await expect(loggedInPage.getByText("My account")).toBeVisible();
  });

  // Este test usa el WORKER FIXTURE (testUser)
  test("Verificar datos generados por el Worker Fixture", async ({
    page,
    testUser,
  }) => {
    // testUser es el objeto que generamos en fixtures.js
    await page.goto("/auth/register");

    // Podemos usar los datos generados
    await page.getByTestId("first-name").fill(testUser.firstName);
    await page.getByTestId("last-name").fill(testUser.lastName);
    await page.getByTestId("email").fill(testUser.email);

    await expect(page.getByTestId("email")).toHaveValue(testUser.email);
  });
});
