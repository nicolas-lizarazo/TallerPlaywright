// tests/api-health.spec.js
const { test, expect } = require("../fixtures");

test("Validar que la API responde usando el Worker Fixture", async ({
  apiContext,
}) => {
  // apiContext es inyectado y compartido a nivel de worker
  const response = await apiContext.get("/products");
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.data)).toBeTruthy();
});
