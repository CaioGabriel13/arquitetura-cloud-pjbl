import { MovieListReader } from "../../application/ports/MovieListReader.js";

/**
 * Caso de uso (Application) — listar o catálogo de filmes para a tela inicial.
 *
 * SRP: apenas orquestra a regra "obter todos os filmes".
 * DIP: depende da abstração MovieListReader, recebida por injeção — não sabe
 *      que, no BFF, quem a implementa é um cliente HTTP do microsserviço.
 * ISP: conhece somente `findAll`, nada de `findById`.
 */
export class ListMoviesUseCase {
  #reader;

  constructor({ movieListReader }) {
    this.#reader = MovieListReader.ensure(movieListReader);
  }

  /** @returns {Promise<import("../../domain/Movie.js").Movie[]>} */
  async execute() {
    return this.#reader.findAll();
  }
}
