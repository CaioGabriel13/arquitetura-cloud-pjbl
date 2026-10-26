import { getMovieByIdReader } from "../../catalog.container.js";
import { GetMovieByIdUseCase } from "./GetMovieByIdUseCase.js";
import { GetMovieByIdController } from "./GetMovieByIdController.js";

/**
 * Composition root da slice "get-movie-by-id":
 * porta (repositório) -> caso de uso -> controller, por injeção de dependência.
 */
export function makeGetMovieByIdController({ movieByIdReader = getMovieByIdReader() } = {}) {
  const getMovieByIdUseCase = new GetMovieByIdUseCase({ movieByIdReader });
  return new GetMovieByIdController({ getMovieByIdUseCase });
}
