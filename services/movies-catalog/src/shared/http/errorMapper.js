import { NotFoundError, ValidationError } from "../domain/errors/index.js";
import { badRequest, notFound, internalError } from "./httpResponses.js";

/**
 * Tabela erro de domínio -> resposta HTTP (Interface Adapters).
 * Novo tipo de erro = nova entrada via registerErrorMapping; nenhum
 * controller ou caso de uso muda.
 */
const mappings = [
  [NotFoundError, (error) => notFound(error.message)],
  [ValidationError, (error) => badRequest(error.message)]
];

export function registerErrorMapping(ErrorType, toResponse) {
  mappings.unshift([ErrorType, toResponse]);
}

export function mapErrorToHttpResponse(error) {
  const match = mappings.find(([ErrorType]) => error instanceof ErrorType);
  return match ? match[1](error) : internalError();
}
