/**
 * Respostas HTTP neutras de framework (Interface Adapters).
 * Controllers devolvem { status, body }; só o servidor HTTP (Frameworks &
 * Drivers) sabe escrever isso no socket.
 */
export const ok = (body) => ({ status: 200, body });

export const badRequest = (message) => ({
  status: 400,
  body: { error: "VALIDATION_ERROR", message }
});

export const notFound = (message) => ({
  status: 404,
  body: { error: "NOT_FOUND", message }
});

export const methodNotAllowed = () => ({
  status: 405,
  body: { error: "METHOD_NOT_ALLOWED", message: "Método não suportado." }
});

export const internalError = () => ({
  status: 500,
  body: { error: "INTERNAL_ERROR", message: "Erro interno ao processar a requisição." }
});
