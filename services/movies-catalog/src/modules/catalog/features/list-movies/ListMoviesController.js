import { ok } from "../../../../shared/http/httpResponses.js";
import { MovieListPresenter } from "./MovieListPresenter.js";

/**
 * Controller (Interface Adapter) — GET /v1/movies[?genre=].
 *
 * Traduz a requisição HTTP neutra ({ params, query }) para o caso de uso e
 * devolve uma resposta HTTP neutra ({ status, body }). Não conhece node:http.
 */
export class ListMoviesController {
  #useCase;

  constructor({ listMoviesUseCase }) {
    this.#useCase = listMoviesUseCase;
  }

  async handle(httpRequest) {
    const movies = await this.#useCase.execute({ genre: httpRequest.query.genre });
    return ok(MovieListPresenter.toResponse(movies));
  }
}
