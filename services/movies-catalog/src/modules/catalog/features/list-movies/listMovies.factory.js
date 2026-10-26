import { getMovieListReader } from "../../catalog.container.js";
import { ListMoviesUseCase } from "./ListMoviesUseCase.js";
import { ListMoviesController } from "./ListMoviesController.js";

/**
 * Composition root da slice "list-movies":
 * porta (repositório) -> caso de uso -> controller, por injeção de dependência.
 */
export function makeListMoviesController({ movieListReader = getMovieListReader() } = {}) {
  const listMoviesUseCase = new ListMoviesUseCase({ movieListReader });
  return new ListMoviesController({ listMoviesUseCase });
}
