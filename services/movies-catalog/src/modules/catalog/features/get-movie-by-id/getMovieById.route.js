import { makeGetMovieByIdController } from "./getMovieById.factory.js";

/**
 * Frameworks & Drivers — rota HTTP da slice "get-movie-by-id".
 */
export const getMovieByIdRoute = Object.freeze({
  method: "GET",
  path: "/v1/movies/:id",
  makeController: makeGetMovieByIdController
});
