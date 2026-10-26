import { ok } from "../../../../shared/http/httpResponses.js";
import { MoviePresenter } from "./MoviePresenter.js";

/**
 * Controller (Interface Adapter) — GET /v1/movies/:id.
 *
 * Erros de domínio (ValidationError / NotFoundError) sobem até o adaptador
 * HTTP, que usa o errorMapper para devolver 400 / 404.
 */
export class GetMovieByIdController {
  #useCase;

  constructor({ getMovieByIdUseCase }) {
    this.#useCase = getMovieByIdUseCase;
  }

  async handle(httpRequest) {
    const movie = await this.#useCase.execute({ id: httpRequest.params.id });
    return ok(MoviePresenter.toResponse(movie));
  }
}
