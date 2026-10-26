import { getMovieByIdReader } from "../../movies.container.js";
import { GetMovieByIdUseCase } from "./GetMovieByIdUseCase.js";
import { GetMovieByIdController } from "./GetMovieByIdController.js";

/**
 * Factory da slice "get-movie-by-id": monta o grafo de objetos
 * (gateway -> caso de uso -> controller) por injeção de dependência.
 */
export function makeGetMovieByIdController({ movieByIdReader = getMovieByIdReader() } = {}) {
  const getMovieByIdUseCase = new GetMovieByIdUseCase({ movieByIdReader });
  return new GetMovieByIdController({ getMovieByIdUseCase });
}
