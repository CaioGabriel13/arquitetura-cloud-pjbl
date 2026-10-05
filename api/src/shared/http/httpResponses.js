/**
 * Fábricas de respostas HTTP neutras de framework.
 * Controllers devolvem este formato ({ status, body }); apenas o adapter
 * do Azure Functions sabe convertê-lo para o formato da plataforma.
 */
const ok = (body) => ({ status: 200, body });
const badRequest = (message) => ({ status: 400, body: { message } });
const notFound = (message) => ({ status: 404, body: { message } });
const internalError = () => ({
  status: 500,
  body: { message: "Erro interno ao processar a requisição." }
});

module.exports = { ok, badRequest, notFound, internalError };
