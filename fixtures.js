// fixtures.js
const base = require("@playwright/test");

const test = base.test.extend({
  // Worker Fixture: se inicializa UNA sola vez por cada proceso worker.
  // Ideal para contextos de API compartidos o configuración global.
  apiContext: [
    async ({ playwright }, use) => {
      const apiContext = await playwright.request.newContext({
        baseURL: "https://api.practicesoftwaretesting.com",
      });
      await use(apiContext);
      // Teardown: se ejecuta al finalizar el worker
      await apiContext.dispose();
    },
    { scope: "worker" },
  ],

  // Test Fixture: se crea una nueva instancia para CADA caso de prueba.
  // Útil para inyectar una página con estado preconfigurado.
  loggedInPage: async ({ page }, use) => {
    // Aquí podrías agregar lógica previa (ej. autenticación previa)
    // Para este taller, pasamos la página directamente.
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
