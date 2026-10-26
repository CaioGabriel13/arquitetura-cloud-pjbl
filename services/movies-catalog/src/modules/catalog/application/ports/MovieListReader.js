import { defineInterface } from "../../../../shared/kernel/defineInterface.js";

/**
 * Porta de saída (Application) — leitura do catálogo completo.
 *
 * Contrato:
 *   findAll(): Promise<Movie[]>   // nunca null; lista vazia se não houver filmes
 *
 * Usada apenas pela slice "list-movies".
 */
export const MovieListReader = defineInterface("MovieListReader", ["findAll"]);
