const { getMovieByIdReader } = require("../../movies.container");
const { GetMovieByIdUseCase } = require("./GetMovieByIdUseCase");
const { GetMovieByIdController } = require("./GetMovieByIdController");

/**
 * Factory da slice "get-movie-by-id": monta o grafo de objetos
 * (repositório -> caso de uso -> controller) por injeção de dependência.
 */
function makeGetMovieByIdController({ movieByIdReader = getMovieByIdReader() } = {}) {
  const getMovieByIdUseCase = new GetMovieByIdUseCase({ movieByIdReader });
  return new GetMovieByIdController({ getMovieByIdUseCase });
}

module.exports = { makeGetMovieByIdController };
