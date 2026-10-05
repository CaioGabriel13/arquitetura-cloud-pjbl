const { NotFoundError } = require("../../../../shared/domain/errors");
const { MovieByIdReader } = require("../../application/ports/MovieByIdReader");
const { MovieId } = require("../../domain/MovieId");

/**
 * Caso de uso (Application) — obter os detalhes de um filme.
 *
 * SRP: valida o id (via Value Object) e aplica a regra "filme inexistente
 *      é um erro de domínio NotFound".
 * DIP: depende da abstração MovieByIdReader, recebida por injeção.
 * ISP: conhece somente `findById`.
 */
class GetMovieByIdUseCase {
  #reader;

  constructor({ movieByIdReader }) {
    this.#reader = MovieByIdReader.ensure(movieByIdReader);
  }

  /**
   * @param {{ id: string | number }} input
   * @returns {Promise<import("../../domain/Movie").Movie>}
   */
  async execute({ id }) {
    const movieId = MovieId.from(id);
    const movie = await this.#reader.findById(movieId);

    if (!movie) {
      throw new NotFoundError(`Filme com id ${movieId} não encontrado.`);
    }
    return movie;
  }
}

module.exports = { GetMovieByIdUseCase };
