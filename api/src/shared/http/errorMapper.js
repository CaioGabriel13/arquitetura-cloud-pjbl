const { NotFoundError, ValidationError } = require("../domain/errors");
const { badRequest, notFound, internalError } = require("./httpResponses");

/**
 * Tabela de mapeamento Erro de domínio -> resposta HTTP.
 *
 * OCP: para suportar um novo tipo de erro basta registrar uma nova entrada
 * (registerErrorMapping) — nenhum controller ou caso de uso é alterado.
 */
const mappings = [
  [NotFoundError, (error) => notFound(error.message)],
  [ValidationError, (error) => badRequest(error.message)]
];

function registerErrorMapping(ErrorType, toResponse) {
  mappings.unshift([ErrorType, toResponse]);
}

function mapErrorToHttpResponse(error) {
  const match = mappings.find(([ErrorType]) => error instanceof ErrorType);
  return match ? match[1](error) : internalError();
}

module.exports = { mapErrorToHttpResponse, registerErrorMapping };
