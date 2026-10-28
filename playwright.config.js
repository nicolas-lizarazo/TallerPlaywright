// playwright.config.js
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  // Ejecución en modo Headless (sin interfaz gráfica)
  use: {
    headless: true,
    // Configuración de evidencias:
    trace: "on", // Captura el Trace Viewer siempre
    screenshot: "only-on-failure", // Captura pantalla solo si falla
    video: "retain-on-failure", // Graba video solo si falla
  },
});
