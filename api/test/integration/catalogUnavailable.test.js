// se o catálogo cair, o BFF tem que devolver 502 e não 500
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "@azure/functions";
import { makeAzureContext, startCatalogStub } from "../helpers/fakes.js";

const registered = {};
let catalog;

before(async () => {
  catalog = await startCatalogStub({ failWith: 503 });
  process.env.MOVIES_CATALOG_URL = catalog.url;
  app.http = (name, options) => {
    registered[name] = options;
  };
  await import("../../src/index.js");
});

after(() => catalog.close());

test("microsserviço fora do ar -> BFF responde 502 Bad Gateway", async () => {
  const response = await registered.getMovies.handler(
    { method: "GET", url: "/api/movies", params: {}, query: new URLSearchParams() },
    makeAzureContext()
  );
  assert.deepEqual(response, {
    status: 502,
    jsonBody: { message: "Catálogo de filmes indisponível no momento. Tente novamente." }
  });
});
