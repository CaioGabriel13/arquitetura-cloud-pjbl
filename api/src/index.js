/**
 * Entry point do BFF (Azure Functions, modelo de programação v4, ES Modules).
 *
 * Cada linha registra uma Vertical Slice. Para adicionar uma nova
 * funcionalidade, cria-se uma nova pasta em modules/<modulo>/features/
 * e adiciona-se UMA linha aqui — nenhuma slice existente é modificada (OCP).
 */
import "./modules/movies/features/list-movies/listMovies.function.js";
import "./modules/movies/features/get-movie-by-id/getMovieById.function.js";
