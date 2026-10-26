import { MovieListReader } from "../../application/ports/MovieListReader.js";

/**
 * Caso de uso (Application) — listar o catálogo, com filtro opcional por gênero.
 *
 * Depende só da porta MovieListReader (recebida por injeção) e do domínio.
 * Não sabe se os dados vêm de memória, banco ou outra API.
 */
export class ListMoviesUseCase {
  #reader;

  constructor({ movieListReader }) {
    this.#reader = MovieListReader.ensure(movieListReader);
  }

  /**
   * @param {{ genre?: string }} [input]
   * @returns {Promise<import("../../domain/Movie.js").Movie[]>}
   */
  async execute({ genre } = {}) {
    const movies = await this.#reader.findAll();
    if (!genre) {
      return movies;
    }
    const wanted = genre.trim().toLocaleLowerCase("pt-BR");
    return movies.filter((movie) => movie.genre.toLocaleLowerCase("pt-BR") === wanted);
  }
}
