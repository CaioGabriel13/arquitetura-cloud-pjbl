import { makeListMoviesController } from "./listMovies.factory.js";

/**
 * Frameworks & Drivers — rota HTTP da slice "list-movies".
 * Equivalente ao arquivo `.function.js` do BFF: liga a slice ao servidor.
 */
export const listMoviesRoute = Object.freeze({
  method: "GET",
  path: "/v1/movies",
  makeController: makeListMoviesController
});
