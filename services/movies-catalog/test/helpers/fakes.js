import { Movie } from "../../src/modules/catalog/domain/Movie.js";

// filme válido padrão para os testes
export function makeMovie(overrides = {}) {
  return Movie.create({
    id: 1,
    title: "Filme Teste",
    releaseYear: 2020,
    genre: "Drama",
    director: "Diretor Teste",
    rating: 7.5,
    synopsis: "Sinopse de teste.",
    posterUrl: "https://example.com/poster.jpg",
    ...overrides
  });
}

// fake das portas MovieListReader / MovieByIdReader
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
