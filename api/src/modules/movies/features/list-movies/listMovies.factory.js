const { getMovieListReader } = require("../../movies.container");
const { ListMoviesUseCase } = require("./ListMoviesUseCase");
const { ListMoviesController } = require("./ListMoviesController");

/**
 * Factory da slice "list-movies": monta o grafo de objetos
 * (repositório -> caso de uso -> controller) por injeção de dependência.
 */
function makeListMoviesController({ movieListReader = getMovieListReader() } = {}) {
  const listMoviesUseCase = new ListMoviesUseCase({ movieListReader });
  return new ListMoviesController({ listMoviesUseCase });
}

module.exports = { makeListMoviesController };
