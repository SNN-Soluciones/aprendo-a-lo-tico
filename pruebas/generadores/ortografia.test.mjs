import { test } from "node:test";
import assert from "node:assert/strict";
import { ESCALONES, JUEGO, TODAS, inicio, reglaDe, regla, revisarOrtografia } from "../../public/js/ortografia.js";
import { azar, SEMILLA, EDADES, problemasDe, noVacio } from "./_azar.mjs";

const TODAS_LAS_PALABRAS = [...TODAS.bv, ...TODAS.scz, ...TODAS.h];

test("ortografía: la letra que falta está donde dice, cada escalón sigue su regla y las letras salen parejas", () => {
  // Arrange
  const rnd = azar(SEMILLA);
  // Act
  const problemas = revisarOrtografia(500, rnd);
  // Assert
  assert.deepEqual(problemas, [], `semilla ${SEMILLA}`);
});

test("la letra que falta calza con la regla de la palabra: mb, -aba y -bir con b; nv con v; -ces con c; z al final; hue- con h", () => {
  // Arrange
  const letraDeLaRegla = { mb: "b", aba: "b", bir: "b", nv: "v", ces: "c", zfinal: "z", hue: "h" };
  // Act
  const malas = TODAS_LAS_PALABRAS
    .filter(p => letraDeLaRegla[reglaDe(p)] && letraDeLaRegla[reglaDe(p)] !== p.l)
    .map(p => `${p.w} (${reglaDe(p)}) falta «${p.l}»`);
  // Assert
  assert.deepEqual(malas, []);
});

test("cada palabra de ortografía trae una regla o una frase para aprenderla", () => {
  // Act
  const sinRegla = TODAS_LAS_PALABRAS.filter(p => !regla(p)?.trim()).map(p => p.w);
  // Assert
  assert.deepEqual(sinRegla, []);
});

noVacio(JUEGO.modos, "JUEGO.modos").forEach((modo, i) => {
  test(`ortografía, modo a mano «${modo.id}»: cada pregunta trae la correcta entre opciones distintas`, () => {
    // Arrange
    const semilla = SEMILLA + 100 + i, rnd = azar(semilla);
    // Act
    const problemas = problemasDe(50, () => modo.preguntas(rnd), ronda => ronda.flatMap(q => {
      const ids = q.opciones.map(o => o.id);
      return [
        ...(ids.filter(id => id === q.correcta).length === 1 ? [] : [`la correcta no está una vez: ${q.voz}`]),
        ...(new Set(ids).size === ids.length ? [] : [`opciones repetidas: ${q.voz}`]),
        ...(q.explica ? [] : [`sin explicación: ${q.voz}`]),
      ];
    }));
    // Assert
    assert.deepEqual(problemas, [], `semilla ${semilla}`);
  });
});

test("inicio de ortografía siempre da un escalón que existe", () => {
  // Act
  const fuera = EDADES.filter(edad => !ESCALONES[inicio(edad)]);
  // Assert
  assert.deepEqual(fuera, []);
});
