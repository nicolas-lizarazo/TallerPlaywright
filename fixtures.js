const base = require("@playwright/test");

const test = base.test.extend({
  // 1. WORKER FIXTURE: Para la API (el que tenías antes)
  apiContext: [
    async ({ playwright }, use) => {
      const apiContext = await playwright.request.newContext({
        baseURL: "https://api.practicesoftwaretesting.com",
      });
      await use(apiContext);
      await apiContext.dispose();
    },
    { scope: "worker" },
  ],

  // 2. WORKER FIXTURE: Para generar el usuario (Punto 3 del taller)
  testUser: [
    async ({}, use) => {
      const user = {
        email: `user_worker_${Date.now()}@test.com`,
        password: "P@ssw0rd_S3gura2026!#",
        firstName: "Worker",
        lastName: "User",
      };
      await use(user);
    },
    { scope: "worker" },
  ],

  // 3. TEST FIXTURE: Para iniciar sesión automáticamente (Punto 3 del taller)
  loggedInPage: async ({ page }, use) => {
    await page.goto("/auth/login");
    await page
      .getByTestId("email")
      .fill("customer@practicesoftwaretesting.com");
    await page.getByTestId("password").fill("welcome01");
    await page.getByTestId("login-submit").click();

    await base.expect(page).toHaveURL(/.*account/, { timeout: 10000 });

    await use(page);
  },
});

module.exports = { test, expect: base.expect };
