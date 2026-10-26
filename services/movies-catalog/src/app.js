import { createHttpServer } from "./shared/infrastructure/http/createHttpServer.js";
import { listMoviesRoute } from "./modules/catalog/features/list-movies/listMovies.route.js";
import { getMovieByIdRoute } from "./modules/catalog/features/get-movie-by-id/getMovieById.route.js";

/**
 * Composition root do microsserviço.
 *
 * Cada item da lista é uma Vertical Slice. Nova funcionalidade = nova pasta
 * em modules/catalog/features/ + uma linha aqui; nenhuma slice existente muda.
 */
export const routes = [listMoviesRoute, getMovieByIdRoute];

export function createApp({ logger } = {}) {
  return createHttpServer({ routes, serviceName: "movies-catalog", logger });
}
