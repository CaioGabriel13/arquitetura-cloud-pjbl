const { mapErrorToHttpResponse } = require("./errorMapper");

/**
 * Adapter (camada Frameworks & Drivers -> Interface Adapters).
 *
 * Converte o HttpRequest do Azure Functions em um objeto neutro
 * ({ params, query }) e a resposta neutra do controller ({ status, body })
 * no formato do Azure ({ status, jsonBody }). Assim, controllers e casos de
 * uso não dependem de `@azure/functions` (DIP) e poderiam ser reutilizados
 * em Express, Fastify, AWS Lambda etc.
 *
 * @param {() => { handle(req: {params: object, query: object}): Promise<{status:number, body:any}> }} makeController
 *        Fábrica do controller (composition root da slice).
 */
function adaptAzureHttp(makeController) {
  const controller = makeController();

  return async function azureHandler(request, context) {
    context.log(`${request.method ?? "GET"} ${request.url ?? ""}`.trim());

    try {
      const httpRequest = {
        params: { ...(request.params ?? {}) },
        query: Object.fromEntries(request.query ?? [])
      };
      const { status, body } = await controller.handle(httpRequest);
      return { status, jsonBody: body };
    } catch (error) {
      const { status, body } = mapErrorToHttpResponse(error);
      if (status >= 500) {
        context.error?.(error);
      }
      return { status, jsonBody: body };
    }
  };
}

module.exports = { adaptAzureHttp };
