import { getMovieListReader } from "../../movies.container.js";
import { ListMoviesUseCase } from "./ListMoviesUseCase.js";
import { ListMoviesController } from "./ListMoviesController.js";

/**
 * Factory da slice "list-movies": monta o grafo de objetos
 * (gateway -> caso de uso -> controller) por injeção de dependência.
 */
export function makeListMoviesController({ movieListReader = getMovieListReader() } = {}) {
  const listMoviesUseCase = new ListMoviesUseCase({ movieListReader });
  return new ListMoviesController({ listMoviesUseCase });
}
