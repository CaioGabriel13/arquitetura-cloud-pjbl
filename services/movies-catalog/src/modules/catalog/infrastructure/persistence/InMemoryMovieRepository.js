import { Movie } from "../../domain/Movie.js";

/**
 * Adapter de persistência (Frameworks & Drivers).
 *
 * Implementa as portas MovieListReader e MovieByIdReader com dados em memória.
 * Pode ser trocado por Cosmos DB / SQL sem alterar nenhum caso de uso.
 */
export class InMemoryMovieRepository {
  #movies;

  /** @param {object[]} seed Dados brutos usados para hidratar as entidades. */
  constructor(seed = []) {
    this.#movies = seed.map((raw) => Movie.create(raw));
  }

  async findAll() {
    return [...this.#movies];
  }

  async findById(movieId) {
    return this.#movies.find((movie) => movie.id.equals(movieId)) ?? null;
  }
}
