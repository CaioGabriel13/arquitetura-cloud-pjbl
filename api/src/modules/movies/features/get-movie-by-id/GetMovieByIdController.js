const { ok } = require("../../../../shared/http/httpResponses");
const { MovieDetailsPresenter } = require("./MovieDetailsPresenter");

/**
 * Controller (Interface Adapter) — GET /api/movies/{id}.
 *
 * SRP: extrai o parâmetro de rota, chama o caso de uso e devolve o DTO.
 * Erros de domínio (ValidationError / NotFoundError) sobem para o adapter,
 * que os converte em 400 / 404 através do errorMapper.
 */
class GetMovieByIdController {
  #useCase;

  /** @param {{ getMovieByIdUseCase: { execute(input: {id: string}): Promise<any> } }} deps */
  constructor({ getMovieByIdUseCase }) {
    this.#useCase = getMovieByIdUseCase;
  }

  async handle(httpRequest) {
    const movie = await this.#useCase.execute({ id: httpRequest.params.id });
    return ok(MovieDetailsPresenter.toDto(movie));
  }
}

module.exports = { GetMovieByIdController };
