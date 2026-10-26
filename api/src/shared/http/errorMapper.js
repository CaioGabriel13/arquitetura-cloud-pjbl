import { NotFoundError, ValidationError } from "../domain/errors/index.js";
import { UpstreamServiceError } from "../application/errors/UpstreamServiceError.js";
import { badGateway, badRequest, internalError, notFound } from "./httpResponses.js";

/**
 * Tabela de mapeamento Erro -> resposta HTTP (Interface Adapters).
 *
 * OCP: para suportar um novo tipo de erro basta registrar uma nova entrada
 * (registerErrorMapping) — nenhum controller ou caso de uso é alterado.
 */
const mappings = [
  [NotFoundError, (error) => notFound(error.message)],
  [ValidationError, (error) => badRequest(error.message)],
  [UpstreamServiceError, () => badGateway()]
];

export function registerErrorMapping(ErrorType, toResponse) {
  mappings.unshift([ErrorType, toResponse]);
}

export function mapErrorToHttpResponse(error) {
  const match = mappings.find(([ErrorType]) => error instanceof ErrorType);
  return match ? match[1](error) : internalError();
}
