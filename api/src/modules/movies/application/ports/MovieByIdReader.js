import { defineInterface } from "../../../../shared/kernel/defineInterface.js";

/**
 * Porta de saída (ISP): busca de um filme pelo identificador.
 *
 * Contrato (LSP — toda implementação deve respeitá-lo):
 *   findById(id: MovieId): Promise<Movie | null>   // null quando não existe; não lança erro
 *
 * Implementada pelo HttpMovieCatalogGateway (chama o microsserviço movies-catalog).
 * Usada apenas pela slice "get-movie-by-id".
 */
export const MovieByIdReader = defineInterface("MovieByIdReader", ["findById"]);
