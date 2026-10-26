import { createServer } from "node:http";
import { Movie } from "../../src/modules/movies/domain/Movie.js";

/** Filme válido para testes. */
export function makeMovie(overrides = {}) {
  return Movie.create({
    id: 1,
    title: "Filme Teste",
    year: 2020,
    genre: "Drama",
    director: "Diretor Teste",
    rating: 7.5,
    synopsis: "Sinopse de teste.",
    poster: "https://example.com/poster.jpg",
    ...overrides
  });
}

/**
 * Implementação fake das portas MovieListReader / MovieByIdReader.
 * Prova de LSP: substitui o HttpMovieCatalogGateway sem alterar casos de uso.
 */
export class FakeMovieReader {
  constructor(movies = []) {
    this.movies = movies;
    this.calls = [];
  }

  async findAll() {
    this.calls.push("findAll");
    return [...this.movies];
  }

  async findById(movieId) {
    this.calls.push(`findById:${movieId.value}`);
    return this.movies.find((m) => m.id.equals(movieId)) ?? null;
  }
}

/** Contexto mínimo do Azure Functions para testes do adapter. */
export function makeAzureContext() {
  const logs = [];
  return { logs, log: (msg) => logs.push(msg), error: (err) => logs.push(err) };
}

/** Filmes no formato do contrato do microsserviço movies-catalog. */
export const catalogMovies = [
  {
    id: 10,
    title: "Filme Stub A",
    releaseYear: 2001,
    genre: "Drama",
    director: "Diretora A",
    rating: 7.1,
    synopsis: "Sinopse A.",
    posterUrl: "https://example.com/a.jpg"
  },
  {
    id: 20,
    title: "Filme Stub B",
    releaseYear: 2012,
    genre: "Ação",
    director: "Diretor B",
    rating: 8.2,
    synopsis: "Sinopse B.",
    posterUrl: "https://example.com/b.jpg"
  }
];

/**
 * Stub HTTP do microsserviço movies-catalog (contrato v1), para testar o BFF
 * de ponta a ponta sem depender do código do outro serviço.
 */
export async function startCatalogStub({ movies = catalogMovies, failWith } = {}) {
  const requests = [];
  const server = createServer((req, res) => {
    requests.push(`${req.method} ${req.url}`);
    const send = (status, body) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (failWith) return send(failWith, { error: "BOOM" });

    const byId = /^\/v1\/movies\/(\d+)$/.exec(req.url);
    if (req.url === "/v1/movies") return send(200, { items: movies, total: movies.length });
    if (byId) {
      const movie = movies.find((m) => m.id === Number(byId[1]));
      return movie ? send(200, movie) : send(404, { error: "NOT_FOUND" });
    }
    return send(404, { error: "NOT_FOUND" });
  });
  await new Promise((resolve) => server.listen(0, resolve));
  return {
    url: `http://localhost:${server.address().port}`,
    requests,
    close: () => new Promise((resolve) => server.close(resolve))
  };
}
