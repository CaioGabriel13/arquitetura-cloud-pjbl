const { ok } = require("../../../../shared/http/httpResponses");
const { MovieSummaryPresenter } = require("./MovieSummaryPresenter");

/**
 * Controller (Interface Adapter) — GET /api/movies.
 *
 * SRP: traduz requisição HTTP neutra -> caso de uso -> resposta HTTP neutra.
 * Não conhece Azure Functions nem a origem dos dados.
 */
class ListMoviesController {
  #useCase;

  /** @param {{ listMoviesUseCase: { execute(): Promise<any[]> } }} deps */
  constructor({ listMoviesUseCase }) {
    this.#useCase = listMoviesUseCase;
  }

  async handle(_httpRequest) {
    const movies = await this.#useCase.execute();
    return ok(MovieSummaryPresenter.toDtoList(movies));
  }
}

module.exports = { ListMoviesController };
