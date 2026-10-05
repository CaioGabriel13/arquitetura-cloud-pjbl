const { Movie } = require("../../domain/Movie");

/**
 * Adapter de persistência (camada Frameworks & Drivers).
 *
 * Implementa as DUAS portas de leitura (MovieListReader e MovieByIdReader)
 * usando dados mock em memória. Pode ser substituído por um repositório
 * Cosmos DB / SQL / API externa sem alterar casos de uso (DIP + LSP).
 */
class InMemoryMovieRepository {
  #movies;

  /** @param {object[]} seed Dados brutos (mock) usados para hidratar as entidades. */
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

module.exports = { InMemoryMovieRepository };
