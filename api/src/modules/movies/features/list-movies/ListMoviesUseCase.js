const { MovieListReader } = require("../../application/ports/MovieListReader");

/**
 * Caso de uso (Application) — listar o catálogo de filmes.
 *
 * SRP: apenas orquestra a regra "obter todos os filmes".
 * DIP: depende da abstração MovieListReader, recebida por injeção.
 * ISP: conhece somente `findAll`, nada de `findById`.
 */
class ListMoviesUseCase {
  #reader;

  constructor({ movieListReader }) {
    this.#reader = MovieListReader.ensure(movieListReader);
  }

  /** @returns {Promise<import("../../domain/Movie").Movie[]>} */
  async execute() {
    return this.#reader.findAll();
  }
}

module.exports = { ListMoviesUseCase };
