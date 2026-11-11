import { test } from "node:test";
import assert from "node:assert/strict";
import { escapar } from "../../public/js/html.js";

test("escapar convierte los cinco caracteres especiales de HTML", () => {
  // Arrange
  const texto = `<b class="x">Tom & 'Jerry'</b>`;
  // Act
  const seguro = escapar(texto);
  // Assert
  assert.equal(seguro, "&lt;b class=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/b&gt;");
});

test("escapar deja igual el texto normal, con tildes, ñ y emoji", () => {
  assert.equal(escapar("Mamá, el niño 🦥 sabe sumar"), "Mamá, el niño 🦥 sabe sumar");
});

test("escapar no deja pasar un script ni un atributo con evento", () => {
  const ataque = `"><img src=x onerror=alert(1)><script>alert(2)</script>`;
  const seguro = escapar(ataque);
  assert.ok(!/[<>"]/.test(seguro), seguro);
});

test("escapar convierte números en texto", () => {
  assert.equal(escapar(42), "42");
  assert.equal(escapar(0), "0");
});

test("escapar devuelve vacío con null o undefined en vez de «null» o «undefined»", () => {
  assert.equal(escapar(null), "");
  assert.equal(escapar(undefined), "");
});

test("escapar no escapa dos veces lo que ya venía escapado: lo vuelve a escapar como texto", () => {
  assert.equal(escapar("&amp;"), "&amp;amp;");
});
