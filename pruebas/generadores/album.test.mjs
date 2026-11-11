import { test } from "node:test";
import assert from "node:assert/strict";
import { STICKERS, TOTAL, siguiente, revisarAlbum } from "../../public/js/album.js";
import { azar, SEMILLA } from "./_azar.mjs";

test("los datos del álbum están bien: ids y nombres únicos, artículos, dibujos y datos cortos", () => {
  // Arrange: los stickers que trae el juego
  // Act
  const problemas = revisarAlbum();
  // Assert
  assert.deepEqual(problemas, []);
});

test("con azar de semilla, siguiente() llena el álbum sin repetir un sticker y después ya no da más", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  let tengo = [];
  // Act
  for (let i = 0; i < TOTAL; i++) {
    const s = siguiente(tengo, rnd);
    assert.ok(s, `se acabaron los stickers a los ${i} (semilla ${SEMILLA})`);
    assert.ok(!tengo.includes(s.id), `repitió ${s.id} (semilla ${SEMILLA})`);
    tengo = [...tengo, s.id];
  }
  // Assert
  assert.equal(new Set(tengo).size, STICKERS.length);
  assert.equal(siguiente(tengo, rnd), null);
});
