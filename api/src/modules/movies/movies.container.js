import { HttpMovieCatalogGateway } from "./infrastructure/gateways/HttpMovieCatalogGateway.js";

/**
 * Composition Root do módulo "movies" do BFF.
 *
 * Único ponto que decide QUAL implementação concreta atende às portas e que
 * lê a configuração do ambiente. As slices pedem "um MovieListReader" /
 * "um MovieByIdReader", não uma classe.
 *
 *   MOVIES_CATALOG_URL         URL base do microsserviço (padrão: http://localhost:3001)
 *   MOVIES_CATALOG_TIMEOUT_MS  timeout das chamadas em ms (padrão: 5000)
 */
let gateway;

function getMovieCatalogGateway() {
  gateway ??= new HttpMovieCatalogGateway({
    baseUrl: process.env.MOVIES_CATALOG_URL ?? "http://localhost:3001",
    timeoutMs: Number(process.env.MOVIES_CATALOG_TIMEOUT_MS ?? 5000)
  });
  return gateway;
}

export const getMovieListReader = getMovieCatalogGateway;
export const getMovieByIdReader = getMovieCatalogGateway;
