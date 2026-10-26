import { defineInterface } from "../../../../shared/kernel/defineInterface.js";

/**
 * Porta de saída (Application) — busca de um filme pelo identificador.
 *
 * Contrato:
 *   findById(id: MovieId): Promise<Movie | null>   // null quando não existe; não lança erro
 *
 * Usada apenas pela slice "get-movie-by-id".
 */
export const MovieByIdReader = defineInterface("MovieByIdReader", ["findById"]);
