/**
 * Erro base de domínio. Camada mais interna: não conhece HTTP.
 * Quem traduz para status HTTP é o errorMapper (Interface Adapters).
 */
export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }
}
