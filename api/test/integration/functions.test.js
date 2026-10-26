/**
 * Teste de integração do BFF: registra as Azure Functions reais (src/index.js)
 * interceptando `app.http` e chama os handlers como o runtime faria. O
 * microsserviço é substituído por um stub HTTP que segue o contrato v1.
 * Garante que o contrato consumido pelo frontend não mudou.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "@azure/functions";
import { makeAzureContext, startCatalogStub } from "../helpers/fakes.js";

const registered = {};
let catalog;

before(async () => {
  catalog = await startCatalogStub();
  process.env.MOVIES_CATALOG_URL = catalog.url;
  app.http = (name, options) => {
    registered[name] = options;
  };
  await import("../../src/index.js");
});

after(() => catalog.close());

const call = (name, params = {}) =>
  registered[name].handler(
    { method: "GET", url: `/api/${name}`, params, query: new URLSearchParams() },
    makeAzureContext()
  );

test("registra as duas functions com as mesmas rotas de antes", () => {
  assert.equal(registered.getMovies.route, "movies");
  assert.equal(registered.getMovieById.route, "movies/{id}");
  assert.deepEqual(registered.getMovies.methods, ["GET"]);
  assert.equal(registered.getMovieById.authLevel, "anonymous");
});

test("GET /api/movies busca no microsserviço e devolve a lista resumida", async () => {
  const response = await call("getMovies");
  assert.equal(response.status, 200);
  assert.deepEqual(response.jsonBody[0], {
    id: 10,
    title: "Filme Stub A",
    year: 2001,
    genre: "Drama",
    rating: 7.1,
    poster: "https://example.com/a.jpg"
  });
  assert.ok(catalog.requests.includes("GET /v1/movies"));
});

test("GET /api/movies/{id} devolve os detalhes completos no contrato do frontend", async () => {
  const response = await call("getMovieById", { id: "20" });
  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(response.jsonBody), [
    "id", "title", "year", "genre", "director", "rating", "synopsis", "poster"
  ]);
});

test("GET /api/movies/{id} inexistente devolve 404 com a mesma mensagem", async () => {
  const response = await call("getMovieById", { id: "99" });
  assert.deepEqual(response, {
    status: 404,
    jsonBody: { message: "Filme com id 99 não encontrado." }
  });
});

test("GET /api/movies/{id} com id inválido devolve 400 sem chamar o microsserviço", async () => {
  const before = catalog.requests.length;
  const response = await call("getMovieById", { id: "abc" });
  assert.equal(response.status, 400);
  assert.equal(catalog.requests.length, before);
});
