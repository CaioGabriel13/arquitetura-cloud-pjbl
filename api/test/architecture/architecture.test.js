/**
 * Testes de arquitetura do BFF (Azure Functions) com ArchUnitTS.
 *
 * Mapa de camadas da Clean Architecture usado nas regras:
 *   Entities ............ src/modules/<m>/domain, src/shared/domain, src/shared/kernel
 *   Use Cases ........... *UseCase.js (dentro das slices), src/modules/<m>/application (portas),
 *                         src/shared/application (erros de aplicação)
 *   Interface Adapters .. *Controller.js, *Presenter.js, src/shared/http
 *   Frameworks & Drivers  src/modules/<m>/infrastructure (gateway HTTP do microsserviço),
 *                         src/shared/infrastructure (adapter do Azure),
 *                         *.function.js, *.factory.js, *.container.js, index.js
 *
 * Vertical Slice: cada pasta em src/modules/movies/features/<slice> é uma
 * funcionalidade completa e não pode importar outra slice.
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { extractGraph, projectFiles } from "archunit";
import { TSCONFIG, escapeRegExp, expectNoViolations, listSlices } from "./archunit.helpers.js";

const files = () => projectFiles(TSCONFIG);

// ---- Camadas ---------------------------------------------------------------
const DOMAIN = /^src\/(modules\/[^/]+\/domain|shared\/domain|shared\/kernel)\//;
const OUTSIDE_DOMAIN = /^src\/(?!(modules\/[^/]+\/domain|shared\/domain|shared\/kernel)\/)/;
const APPLICATION = /^src\/(modules\/[^/]+\/application|shared\/application)\//;
const OUTSIDE_DOMAIN_AND_APPLICATION =
  /^src\/(?!(modules\/[^/]+\/domain|modules\/[^/]+\/application|shared\/domain|shared\/kernel|shared\/application)\/)/;
const USE_CASE = /UseCase\.js$/;
const ADAPTER = /(Controller|Presenter)\.js$/;
const SHARED_HTTP_ADAPTERS = /^src\/shared\/http\//;
const INFRASTRUCTURE = /^src\/(modules\/[^/]+\/infrastructure|shared\/infrastructure)\//;
const COMPOSITION = /(\.factory|\.function|\.container|^index)\.js$/;
const FEATURES = "src/modules/movies/features";

describe("Clean Architecture — Regra da Dependência", () => {
  test("domínio (entidades, value objects, erros, kernel) não depende de nenhuma camada externa", async () => {
    await expectNoViolations(
      files().inPath(DOMAIN).shouldNot().dependOnFiles().inPath(OUTSIDE_DOMAIN)
    );
  });

  test("Application (portas e erros de aplicação) depende somente do domínio", async () => {
    await expectNoViolations(
      files().inPath(APPLICATION).shouldNot().dependOnFiles().inPath(OUTSIDE_DOMAIN_AND_APPLICATION)
    );
  });

  test("casos de uso dependem somente de domínio e Application", async () => {
    // (?!.*UseCase\.js$) ignora a aresta do próprio arquivo, que o grafo também registra
    const outsideInnerLayers = new RegExp(
      OUTSIDE_DOMAIN_AND_APPLICATION.source + String.raw`(?!.*UseCase\.js$)`
    );
    await expectNoViolations(
      files().withName(USE_CASE).shouldNot().dependOnFiles().inPath(outsideInnerLayers)
    );
  });

  test("casos de uso não conhecem controllers nem presenters", async () => {
    await expectNoViolations(
      files().withName(USE_CASE).shouldNot().dependOnFiles().withName(ADAPTER)
    );
  });

  test("casos de uso dependem de uma porta (abstração), nunca do gateway HTTP concreto", async () => {
    await expectNoViolations(
      files()
        .withName(USE_CASE)
        .should()
        .adhereTo(
          (file) => /from\s+["'][^"']*\/application\/ports\//.test(file.content),
          "todo caso de uso deve importar ao menos uma porta de application/ports"
        )
    );
    await expectNoViolations(
      files().withName(USE_CASE).shouldNot().dependOnFiles().inPath(INFRASTRUCTURE)
    );
  });

  test("controllers e presenters não dependem de infraestrutura", async () => {
    await expectNoViolations(
      files().withName(ADAPTER).shouldNot().dependOnFiles().inPath(INFRASTRUCTURE)
    );
  });

  test("controllers e presenters não dependem da composição (factory/function/container)", async () => {
    await expectNoViolations(
      files().withName(ADAPTER).shouldNot().dependOnFiles().withName(COMPOSITION)
    );
  });

  test("adaptadores HTTP neutros (shared/http) não dependem de infraestrutura nem de slices", async () => {
    await expectNoViolations(
      files().inPath(SHARED_HTTP_ADAPTERS).shouldNot().dependOnFiles().inPath(INFRASTRUCTURE)
    );
    await expectNoViolations(
      files().inPath(SHARED_HTTP_ADAPTERS).shouldNot().dependOnFiles().inFolder(`${FEATURES}/**`)
    );
  });

  test("gateway (infraestrutura) não depende de casos de uso nem de controllers", async () => {
    await expectNoViolations(
      files()
        .inFolder("src/modules/*/infrastructure/**")
        .shouldNot()
        .dependOnFiles()
        .inFolder(`${FEATURES}/**`)
    );
  });
});

describe("Vertical Slice — isolamento entre funcionalidades", () => {
  const slices = listSlices(FEATURES);

  test("existem slices para isolar", () => {
    assert.deepEqual(slices.sort(), ["get-movie-by-id", "list-movies"]);
  });

  for (const slice of slices) {
    test(`slice "${slice}" não importa nenhuma outra slice`, async () => {
      const otherSlices = new RegExp(`^${escapeRegExp(FEATURES)}/(?!${escapeRegExp(slice)}/)`);
      await expectNoViolations(
        files().inFolder(`${FEATURES}/${slice}/**`).shouldNot().dependOnFiles().inPath(otherSlices)
      );
    });
  }

  test("arquivos das slices seguem a convenção de nomes por camada", async () => {
    await expectNoViolations(
      files()
        .inFolder(`${FEATURES}/**`)
        .should()
        .haveName(/^([A-Z]\w*(UseCase|Controller|Presenter)|[a-z]\w*\.(factory|function))\.js$/)
    );
  });
});

describe("BFF — papel de Backend for Frontend", () => {
  test("somente as *.function.js e o adapter do Azure importam @azure/functions", async () => {
    await expectNoViolations(
      files()
        .inFolder("src/**")
        .should()
        .adhereTo(
          (file) =>
            !/from\s+["']@azure\/functions["']/.test(file.content) ||
            file.path.endsWith(".function.js") ||
            file.path.includes("src/shared/infrastructure/azure/"),
          "@azure/functions só pode ser importado em *.function.js ou shared/infrastructure/azure"
        )
    );
  });

  test("o BFF não tem persistência própria: a infraestrutura do módulo só contém gateways", async () => {
    await expectNoViolations(
      files()
        .inFolder("src/modules/*/infrastructure/**")
        .should()
        .beInFolder("src/modules/*/infrastructure/gateways/**")
    );
    await expectNoViolations(
      files().inFolder("src/modules/*/infrastructure/**").should().haveName(/^[A-Z]\w*Gateway\.js$/)
    );
  });

  test("somente os gateways acessam a rede (fetch) para falar com os microsserviços", async () => {
    await expectNoViolations(
      files()
        .inFolder("src/**")
        .should()
        .adhereTo(
          (file) =>
            !/\bfetch\s*\(|globalThis\.fetch/.test(file.content) ||
            file.path.includes("/infrastructure/gateways/"),
          "acesso HTTP de saída só em src/modules/<m>/infrastructure/gateways"
        )
    );
  });

  test("domínio e casos de uso não fazem I/O nem leem configuração (process.env, fetch, console)", async () => {
    const noIo = (file) => !/\b(process\.env|fetch\(|console\.)/.test(file.content);
    await expectNoViolations(
      files().inPath(DOMAIN).should().adhereTo(noIo, "domínio deve ser puro")
    );
    await expectNoViolations(
      files().withName(USE_CASE).should().adhereTo(noIo, "caso de uso não faz I/O direto")
    );
  });
});

describe("Saúde do grafo de dependências", () => {
  test("não há dependências cíclicas entre arquivos", async () => {
    await expectNoViolations(files().inFolder("src/**").should().haveNoCycles());
  });

  test("o ArchUnitTS enxergou os imports do projeto (sanidade contra falso positivo)", async () => {
    const graph = await extractGraph(TSCONFIG);
    const edges = graph.filter((edge) => edge.source !== edge.target && !edge.external);
    assert.ok(edges.length >= 30, `poucas dependências extraídas: ${edges.length}`);
    assert.ok(
      edges.some(
        (edge) =>
          edge.source.endsWith("movies.container.js") &&
          edge.target.endsWith("infrastructure/gateways/HttpMovieCatalogGateway.js")
      ),
      "dependência movies.container -> HttpMovieCatalogGateway não encontrada"
    );
  });
});
