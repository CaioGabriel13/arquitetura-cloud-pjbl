import { test } from "node:test";
import assert from "node:assert/strict";
import { HttpMovieCatalogGateway } from "../../src/modules/movies/infrastructure/gateways/HttpMovieCatalogGateway.js";
import { MovieListReader } from "../../src/modules/movies/application/ports/MovieListReader.js";
import { MovieByIdReader } from "../../src/modules/movies/application/ports/MovieByIdReader.js";
import { MovieId } from "../../src/modules/movies/domain/MovieId.js";
import { Movie } from "../../src/modules/movies/domain/Movie.js";
import { UpstreamServiceError } from "../../src/shared/application/errors/UpstreamServiceError.js";
import { catalogMovies } from "../helpers/fakes.js";

/** fetch falso que registra as URLs chamadas e devolve respostas prontas. */
function fakeFetch(respond) {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    return respond(String(url));
  };
  return { calls, fetchImpl };
}

const json = (status, body) => new Response(JSON.stringify(body), { status });
const gatewayWith = (fetchImpl) =>
  new HttpMovieCatalogGateway({ baseUrl: "http://catalog.local", fetchImpl });

test("gateway cumpre as duas portas da Application (LSP)", () => {
  const gateway = gatewayWith(async () => json(200, {}));
  assert.ok(MovieListReader.isImplementedBy(gateway));
  assert.ok(MovieByIdReader.isImplementedBy(gateway));
});

test("findAll chama GET /v1/movies e converte o contrato do catálogo em Movie", async () => {
  const { calls, fetchImpl } = fakeFetch(() => json(200, { items: catalogMovies, total: 2 }));
  const movies = await gatewayWith(fetchImpl).findAll();

  assert.deepEqual(calls, ["http://catalog.local/v1/movies"]);
  assert.ok(movies.every((movie) => movie instanceof Movie));
  assert.equal(movies[0].year, 2001); // releaseYear -> year
  assert.equal(movies[1].poster, "https://example.com/b.jpg"); // posterUrl -> poster
});

test("findById chama GET /v1/movies/{id} e devolve null em 404", async () => {
  const { calls, fetchImpl } = fakeFetch((url) =>
    url.endsWith("/10") ? json(200, catalogMovies[0]) : json(404, { error: "NOT_FOUND" })
  );
  const gateway = gatewayWith(fetchImpl);

  assert.equal((await gateway.findById(MovieId.from(10))).title, "Filme Stub A");
  assert.equal(await gateway.findById(MovieId.from(99)), null);
  assert.deepEqual(calls, ["http://catalog.local/v1/movies/10", "http://catalog.local/v1/movies/99"]);
});

test("5xx do microsserviço vira UpstreamServiceError", async () => {
  const { fetchImpl } = fakeFetch(() => json(503, { error: "UNAVAILABLE" }));
  await assert.rejects(() => gatewayWith(fetchImpl).findAll(), UpstreamServiceError);
});

test("falha de rede / timeout vira UpstreamServiceError", async () => {
  const gateway = gatewayWith(async () => {
    throw new TypeError("fetch failed");
  });
  await assert.rejects(() => gateway.findById(MovieId.from(1)), UpstreamServiceError);
});
