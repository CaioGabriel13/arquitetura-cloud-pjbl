import { DomainError } from "./DomainError.js";

/** Dado de entrada ou invariante de domínio inválido. */
export class ValidationError extends DomainError {}
