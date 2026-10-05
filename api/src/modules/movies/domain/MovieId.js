const { ValidationError } = require("../../../shared/domain/errors");

/**
 * Value Object — identificador de filme.
 * Garante a invariante "id é inteiro positivo" em um único lugar (SRP).
 */
class MovieId {
  #value;

  constructor(value) {
    this.#value = value;
    Object.freeze(this);
  }

  /** Cria um MovieId a partir de entrada externa (string ou número). */
  static from(raw) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
      throw new ValidationError(
        `Id de filme inválido: "${raw}". Informe um número inteiro positivo.`
      );
    }
    return new MovieId(value);
  }

  get value() {
    return this.#value;
  }

  equals(other) {
    return other instanceof MovieId && other.value === this.#value;
  }

  toString() {
    return String(this.#value);
  }
}

module.exports = { MovieId };
