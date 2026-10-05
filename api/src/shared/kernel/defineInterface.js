/**
 * Shared Kernel — contrato de interface (porta) em JavaScript.
 *
 * JavaScript não possui `interface` nativa. Este helper cria um contrato
 * explícito (nome + métodos obrigatórios) que os casos de uso usam para
 * validar, no momento da composição, que a dependência injetada cumpre o
 * contrato (fail-fast). É a base para aplicar ISP, LSP e DIP no backend.
 *
 * @param {string} name     Nome da interface (ex.: "MovieListReader").
 * @param {string[]} methods Métodos que toda implementação deve expor.
 */
function defineInterface(name, methods) {
  const contract = Object.freeze([...methods]);

  return Object.freeze({
    name,
    methods: contract,

    /** Retorna true se `candidate` implementa todos os métodos do contrato. */
    isImplementedBy(candidate) {
      return (
        candidate != null &&
        contract.every((method) => typeof candidate[method] === "function")
      );
    },

    /** Lança erro se `candidate` não cumprir o contrato; caso contrário, devolve-o. */
    ensure(candidate) {
      if (!this.isImplementedBy(candidate)) {
        const missing = contract.filter(
          (method) => typeof candidate?.[method] !== "function"
        );
        throw new TypeError(
          `Dependência inválida: esperado ${name} (faltando: ${missing.join(", ")}).`
        );
      }
      return candidate;
    }
  });
}

module.exports = { defineInterface };
