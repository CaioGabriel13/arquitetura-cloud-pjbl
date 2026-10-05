/**
 * Erro base do domínio. Não conhece HTTP: o mapeamento para status code
 * é responsabilidade da camada de interface (shared/http/errorMapper.js).
 */
class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = { DomainError };
