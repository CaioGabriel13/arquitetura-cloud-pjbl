import { InMemoryMovieRepository } from "./infrastructure/persistence/InMemoryMovieRepository.js";
import { moviesSeed } from "./infrastructure/persistence/moviesSeed.js";

/**
 * Composition root do módulo "catalog".
 *
 * Único ponto que decide QUAL implementação concreta atende às portas.
 * Trocar o mock por um banco real altera só este arquivo.
 */
let repository;

function getMovieRepository() {
  repository ??= new InMemoryMovieRepository(moviesSeed);
  return repository;
}

export const getMovieListReader = getMovieRepository;
export const getMovieByIdReader = getMovieRepository;
