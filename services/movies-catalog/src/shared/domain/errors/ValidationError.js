import { DomainError } from "./DomainError.js";

/** Violação de invariante de domínio (ex.: id não numérico, nota fora de 0–10). */
export class ValidationError extends DomainError {}
