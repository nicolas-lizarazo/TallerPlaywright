// playwright.config.js
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",

  // Configuración de evidencias y tiempo de espera
  timeout: 60000, // Aumentamos a 60 segundos para evitar timeouts en redes lentas

  use: {
    baseURL: "https://practicesoftwaretesting.com",
    testIdAttribute: "data-test", // Permite usar getByTestId con los atributos data-test de la página
    trace: "on", // Genera el Trace Viewer siempre
    screenshot: "only-on-failure", // Captura pantalla solo si el test falla
    video: "retain-on-failure", // Graba video solo si el test falla
    headless: true, // Ejecución en segundo plano (sin interfaz gráfica)
  },

  // Si tienes más configuraciones (como reporteros), agrégalas aquí debajo
  reporter: [["html"], ["list"]],
});
