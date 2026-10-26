import { test } from "node:test";
import assert from "node:assert/strict";
import { MovieId } from "../../src/modules/movies/domain/MovieId.js";
import { ValidationError } from "../../src/shared/domain/errors/index.js";
import { makeMovie } from "../helpers/fakes.js";

test("MovieId aceita inteiro positivo vindo de string", () => {
  assert.equal(MovieId.from("3").value, 3);
});

test("MovieId rejeita valores inválidos com ValidationError", () => {
  for (const raw of ["abc", "0", "-1", "1.5", "", undefined]) {
    assert.throws(() => MovieId.from(raw), ValidationError, `deveria rejeitar ${raw}`);
  }
});

test("MovieId compara por valor", () => {
  assert.ok(MovieId.from(2).equals(MovieId.from("2")));
  assert.ok(!MovieId.from(2).equals(MovieId.from(3)));
});

test("Movie é imutável e valida invariantes", () => {
  const movie = makeMovie();
  assert.ok(Object.isFrozen(movie));
  assert.throws(() => makeMovie({ title: "" }), ValidationError);
  assert.throws(() => makeMovie({ rating: 11 }), ValidationError);
  assert.throws(() => makeMovie({ year: 1500 }), ValidationError);
});
