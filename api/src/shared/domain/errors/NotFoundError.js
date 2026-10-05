const { DomainError } = require("./DomainError");

/** Recurso solicitado não existe. */
class NotFoundError extends DomainError {}

module.exports = { NotFoundError };
