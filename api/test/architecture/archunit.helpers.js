import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** tsconfig do serviço: o ArchUnitTS usa o compilador TS para ler os imports dos .js. */
export const TSCONFIG = fileURLToPath(new URL("../../tsconfig.json", import.meta.url));

/** Executa a regra do ArchUnitTS e falha listando cada violação encontrada. */
export async function expectNoViolations(rule) {
  const violations = await rule.check();
  assert.equal(
    violations.length,
    0,
    `Violações de arquitetura (${violations.length}):\n` +
      violations.map((violation) => `  - ${describeViolation(violation)}`).join("\n")
  );
}

/** Lista as Vertical Slices existentes (uma pasta por funcionalidade). */
export function listSlices(featuresDir) {
  const url = new URL(`../../${featuresDir}/`, import.meta.url);
  return readdirSync(url, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/** Escapa texto para uso dentro de uma RegExp. */
export const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function describeViolation(violation) {
  if (violation.dependency) {
    return `${violation.dependency.sourceLabel} -> ${violation.dependency.targetLabel}`;
  }
  if (violation.cycle) {
    return `ciclo: ${violation.cycle.map((edge) => edge.sourceLabel).join(" -> ")}`;
  }
  if (violation.projectedNode) {
    return `${violation.projectedNode.label} (padrão esperado: ${violation.checkPattern})`;
  }
  if (violation.fileInfo) {
    return `${violation.fileInfo.path}: ${violation.message}`;
  }
  return violation.message ?? JSON.stringify(violation);
}
