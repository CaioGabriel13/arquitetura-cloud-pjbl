import { UpstreamServiceError } from "../../../../shared/application/errors/UpstreamServiceError.js";
import { Movie } from "../../domain/Movie.js";

const SERVICE = "movies-catalog";

/**
 * Gateway HTTP (Frameworks & Drivers) — cliente do microsserviço movies-catalog.
 *
 * Implementa as portas MovieListReader e MovieByIdReader, substituindo o antigo
 * repositório em memória sem alterar nenhum caso de uso (DIP + LSP).
 *
 * Funciona também como camada anticorrupção: converte o contrato do
 * microsserviço ({ items, total }, releaseYear, posterUrl) na entidade Movie
 * do BFF. Falhas de rede, timeout ou 5xx viram UpstreamServiceError (-> 502).
 */
export class HttpMovieCatalogGateway {
  #baseUrl;
  #fetch;
  #timeoutMs;

  /**
   * @param {{ baseUrl: string, fetchImpl?: typeof fetch, timeoutMs?: number }} options
   */
  constructor({ baseUrl, fetchImpl = globalThis.fetch, timeoutMs = 5000 }) {
    if (!baseUrl) {
      throw new TypeError("HttpMovieCatalogGateway: baseUrl é obrigatório.");
    }
    this.#baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    this.#fetch = fetchImpl;
    this.#timeoutMs = timeoutMs;
  }

  async findAll() {
    const body = await this.#getJson("v1/movies");
    if (!Array.isArray(body?.items)) {
      throw new UpstreamServiceError(SERVICE, "resposta sem a lista 'items'.");
    }
    return body.items.map(toMovie);
  }

  async findById(movieId) {
    const body = await this.#getJson(`v1/movies/${movieId.value}`, { notFoundAsNull: true });
    return body === null ? null : toMovie(body);
  }

  async #getJson(path, { notFoundAsNull = false } = {}) {
    let response;
    try {
      response = await this.#fetch(new URL(path, this.#baseUrl), {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(this.#timeoutMs)
      });
    } catch (cause) {
      throw new UpstreamServiceError(SERVICE, "serviço indisponível ou sem resposta.", { cause });
    }

    if (notFoundAsNull && response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new UpstreamServiceError(SERVICE, `respondeu HTTP ${response.status}.`, {
        status: response.status
      });
    }
    return response.json();
  }
}

/** DTO do microsserviço -> entidade do BFF. */
function toMovie(dto) {
  return Movie.create({
    id: dto.id,
    title: dto.title,
    year: dto.releaseYear,
    genre: dto.genre,
    director: dto.director,
    rating: dto.rating,
    synopsis: dto.synopsis,
    poster: dto.posterUrl
  });
}
