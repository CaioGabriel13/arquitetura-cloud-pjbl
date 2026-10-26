import { defineInterface } from "../../../../shared/kernel/defineInterface.js";

/**
 * Porta de saída (ISP): leitura da lista completa de filmes.
 *
 * Contrato (LSP — toda implementação deve respeitá-lo):
 *   findAll(): Promise<Movie[]>   // nunca null; lista vazia se não houver filmes
 *
 * Implementada pelo HttpMovieCatalogGateway (chama o microsserviço movies-catalog).
 * Usada apenas pela slice "list-movies".
 */
export const MovieListReader = defineInterface("MovieListReader", ["findAll"]);
