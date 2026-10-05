const { Movie } = require("../../src/modules/movies/domain/Movie");

/** Filme válido para testes. */
function makeMovie(overrides = {}) {
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
 * Prova de LSP: substitui o InMemoryMovieRepository sem alterar casos de uso.
 */
class FakeMovieReader {
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
function makeAzureContext() {
  const logs = [];
  return { logs, log: (msg) => logs.push(msg), error: (err) => logs.push(err) };
}

module.exports = { makeMovie, FakeMovieReader, makeAzureContext };
