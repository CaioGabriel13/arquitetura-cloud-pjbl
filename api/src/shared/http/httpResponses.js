/**
 * Fábricas de respostas HTTP neutras de framework (Interface Adapters).
 * Controllers devolvem este formato ({ status, body }); apenas o adapter
 * do Azure Functions sabe convertê-lo para o formato da plataforma.
 */
export const ok = (body) => ({ status: 200, body });
export const badRequest = (message) => ({ status: 400, body: { message } });
export const notFound = (message) => ({ status: 404, body: { message } });
export const badGateway = () => ({
  status: 502,
  body: { message: "Catálogo de filmes indisponível no momento. Tente novamente." }
});
export const internalError = () => ({
  status: 500,
  body: { message: "Erro interno ao processar a requisição." }
});
