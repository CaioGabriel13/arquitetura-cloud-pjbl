/**
 * Entry point do Azure Functions (modelo de programação v4).
 *
 * Cada linha registra uma Vertical Slice. Para adicionar uma nova
 * funcionalidade, cria-se uma nova pasta em modules/<modulo>/features/
 * e adiciona-se UMA linha aqui — nenhuma slice existente é modificada (OCP).
 */
require("./modules/movies/features/list-movies/listMovies.function");
require("./modules/movies/features/get-movie-by-id/getMovieById.function");
