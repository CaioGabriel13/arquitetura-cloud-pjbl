import { createServer } from "node:http";
import { Movie } from "../../src/modules/movies/domain/Movie.js";

// filme válido padrão para os testes
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

// fake das portas MovieListReader / MovieByIdReader (no lugar do gateway HTTP)
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

// context fake do Azure Functions
export function makeAzureContext() {
  const logs = [];
  return { logs, log: (msg) => logs.push(msg), error: (err) => logs.push(err) };
}

// filmes no formato que o movies-catalog devolve
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

// servidor fake que imita as rotas v1 do movies-catalog
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
