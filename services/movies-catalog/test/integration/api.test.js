// sobe o servidor numa porta livre e chama a API por HTTP
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

const get = async (path, init) => {
  const response = await fetch(`${baseUrl}${path}`, init);
  return { status: response.status, body: await response.json() };
};

test("GET /health responde ok", async () => {
  assert.deepEqual(await get("/health"), {
    status: 200,
    body: { status: "ok", service: "movies-catalog" }
  });
});

test("GET /v1/movies devolve { items, total } com o contrato do catálogo", async () => {
  const { status, body } = await get("/v1/movies");
  assert.equal(status, 200);
  assert.equal(body.total, 6);
  assert.equal(body.items[0].title, "Interestelar");
  assert.deepEqual(Object.keys(body.items[0]), [
    "id", "title", "releaseYear", "genre", "director", "rating", "synopsis", "posterUrl"
  ]);
});

test("GET /v1/movies?genre=Drama filtra pelo gênero", async () => {
  const { body } = await get("/v1/movies?genre=Drama");
  assert.deepEqual(body.items.map((m) => m.title), ["O Poderoso Chefão", "Coringa"]);
});

test("GET /v1/movies/:id devolve o filme", async () => {
  const { status, body } = await get("/v1/movies/3");
  assert.equal(status, 200);
  assert.equal(body.title, "Matrix");
});

test("GET /v1/movies/:id inexistente devolve 404", async () => {
  assert.deepEqual(await get("/v1/movies/99"), {
    status: 404,
    body: { error: "NOT_FOUND", message: "Filme com id 99 não encontrado." }
  });
});

test("GET /v1/movies/:id inválido devolve 400", async () => {
  const { status, body } = await get("/v1/movies/abc");
  assert.equal(status, 400);
  assert.equal(body.error, "VALIDATION_ERROR");
});

test("rota desconhecida devolve 404 e método errado devolve 405", async () => {
  assert.equal((await get("/v1/series")).status, 404);
  assert.equal((await get("/v1/movies", { method: "POST" })).status, 405);
});
