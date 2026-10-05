const { InMemoryMovieRepository } = require("./infrastructure/persistence/InMemoryMovieRepository");
const { moviesSeed } = require("./infrastructure/persistence/moviesSeed");

/**
 * Composition Root do módulo "movies".
 *
 * Único ponto que decide QUAL implementação concreta atende às portas.
 * Para trocar o mock por um banco real, altera-se somente este arquivo
 * (as slices pedem "um MovieListReader" / "um MovieByIdReader", não uma classe).
 */
let repository;

function getMovieRepository() {
  repository ??= new InMemoryMovieRepository(moviesSeed);
  return repository;
}

module.exports = {
  getMovieListReader: getMovieRepository,
  getMovieByIdReader: getMovieRepository
};
