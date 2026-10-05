/**
 * Teste de integração: registra as Azure Functions reais (src/index.js)
 * interceptando `app.http` e chama os handlers como o runtime faria.
 * Garante que o contrato consumido pelo frontend não mudou após a refatoração.
 */
const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("@azure/functions");
const { makeAzureContext } = require("../helpers/fakes");

const registered = {};

before(() => {
  app.http = (name, options) => {
    registered[name] = options;
  };
  require("../../src/index");
});

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

test("GET /api/movies devolve a lista resumida (sem director/synopsis)", async () => {
  const response = await call("getMovies");
  assert.equal(response.status, 200);
  assert.equal(response.jsonBody.length, 6);
  assert.deepEqual(Object.keys(response.jsonBody[0]), [
    "id", "title", "year", "genre", "rating", "poster"
  ]);
  assert.equal(response.jsonBody[0].title, "Interestelar");
});

test("GET /api/movies/{id} devolve os detalhes completos", async () => {
  const response = await call("getMovieById", { id: "3" });
  assert.equal(response.status, 200);
  assert.equal(response.jsonBody.title, "Matrix");
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

test("GET /api/movies/{id} com id inválido devolve 400", async () => {
  const response = await call("getMovieById", { id: "abc" });
  assert.equal(response.status, 400);
});
