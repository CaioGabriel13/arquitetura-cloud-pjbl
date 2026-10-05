const { defineInterface } = require("../../../../shared/kernel/defineInterface");

/**
 * Porta de saída (ISP): leitura da lista completa de filmes.
 *
 * Contrato (LSP — toda implementação deve respeitá-lo):
 *   findAll(): Promise<Movie[]>   // nunca null; lista vazia se não houver filmes
 *
 * Usada apenas pela slice "list-movies".
 */
const MovieListReader = defineInterface("MovieListReader", ["findAll"]);

module.exports = { MovieListReader };
