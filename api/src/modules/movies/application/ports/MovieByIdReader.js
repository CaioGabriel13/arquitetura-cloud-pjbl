const { defineInterface } = require("../../../../shared/kernel/defineInterface");

/**
 * Porta de saída (ISP): busca de um filme pelo identificador.
 *
 * Contrato (LSP — toda implementação deve respeitá-lo):
 *   findById(id: MovieId): Promise<Movie | null>   // null quando não existe; não lança erro
 *
 * Usada apenas pela slice "get-movie-by-id".
 */
const MovieByIdReader = defineInterface("MovieByIdReader", ["findById"]);

module.exports = { MovieByIdReader };
