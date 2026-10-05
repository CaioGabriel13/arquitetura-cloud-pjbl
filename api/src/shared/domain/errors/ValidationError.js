const { DomainError } = require("./DomainError");

/** Dado de entrada ou invariante de domínio inválido. */
class ValidationError extends DomainError {}

module.exports = { ValidationError };
