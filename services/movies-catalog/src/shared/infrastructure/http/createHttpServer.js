import { createServer } from "node:http";
import { mapErrorToHttpResponse } from "../../http/errorMapper.js";
import { methodNotAllowed, notFound, ok } from "../../http/httpResponses.js";

/**
 * Frameworks & Drivers — servidor HTTP do microsserviço (node:http puro).
 *
 * Único arquivo do serviço que conhece `node:http`. Converte a requisição
 * nativa em um objeto neutro ({ params, query }), chama o controller da
 * slice e escreve a resposta neutra ({ status, body }) como JSON.
 *
 * @param {{
 *   routes: { method: string, path: string, makeController: () => { handle(req: object): Promise<{status: number, body: unknown}> } }[],
 *   serviceName?: string,
 *   logger?: { info(msg: string): void, error(err: unknown): void }
 * }} options
 */
export function createHttpServer({ routes, serviceName = "movies-catalog", logger = silentLogger }) {
  const compiled = routes.map((route) => ({
    ...route,
    matcher: compilePath(route.path),
    controller: route.makeController()
  }));

  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    logger.info(`${req.method} ${url.pathname}${url.search}`);

    if (url.pathname === "/health") {
      return send(res, ok({ status: "ok", service: serviceName }));
    }

    const candidates = compiled
      .map((route) => ({ route, params: route.matcher(url.pathname) }))
      .filter(({ params }) => params !== null);

    if (candidates.length === 0) {
      return send(res, notFound(`Rota não encontrada: ${url.pathname}`));
    }

    const match = candidates.find(({ route }) => route.method === req.method);
    if (!match) {
      return send(res, methodNotAllowed());
    }

    try {
      const httpRequest = {
        params: match.params,
        query: Object.fromEntries(url.searchParams)
      };
      return send(res, await match.route.controller.handle(httpRequest));
    } catch (error) {
      const response = mapErrorToHttpResponse(error);
      if (response.status >= 500) {
        logger.error(error);
      }
      return send(res, response);
    }
  });
}

/** "/v1/movies/:id" -> função que devolve { id: "3" } ou null. */
export function compilePath(path) {
  const names = [];
  const pattern = path
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        names.push(segment.slice(1));
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  const regex = new RegExp(`^${pattern}/?$`);

  return (pathname) => {
    const found = regex.exec(pathname);
    if (!found) {
      return null;
    }
    return Object.fromEntries(names.map((name, i) => [name, decodeURIComponent(found[i + 1])]));
  };
}

function send(res, { status, body }) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

const silentLogger = { info() {}, error() {} };
