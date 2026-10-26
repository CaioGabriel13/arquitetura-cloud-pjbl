/**
 * Erro da camada Application: um serviço do qual o BFF depende (ex.: o
 * microsserviço movies-catalog) falhou ou não respondeu.
 *
 * Não é regra de negócio (por isso não estende DomainError), mas também não
 * conhece HTTP: o errorMapper o traduz para 502 Bad Gateway.
 */
export class UpstreamServiceError extends Error {
  /**
   * @param {string} service  Nome do serviço de origem.
   * @param {string} reason   Descrição curta da falha.
   * @param {{ cause?: unknown, status?: number }} [details]
   */
  constructor(service, reason, { cause, status } = {}) {
    super(`Falha ao consultar ${service}: ${reason}`, { cause });
    this.name = "UpstreamServiceError";
    this.service = service;
    this.status = status;
  }
}
