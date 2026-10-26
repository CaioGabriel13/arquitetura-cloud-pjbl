// Testes de arquitetura do BFF com ArchUnitTS.
// Cada pasta em src/modules/movies/features é uma slice e não pode importar outra.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { extractGraph, projectFiles } from "archunit";
import { TSCONFIG, escapeRegExp, expectNoViolations, listSlices } from "./archunit.helpers.js";

const files = () => projectFiles(TSCONFIG);

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

describe("Clean Architecture - regra da dependência", () => {
  test("domínio não depende de nenhuma camada externa", async () => {
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
    // o grafo inclui o próprio arquivo do use case, então ele é ignorado aqui
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

  test("casos de uso dependem da porta e não do gateway HTTP", async () => {
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

describe("Vertical Slice - isolamento entre slices", () => {
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

describe("BFF", () => {
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

  test("infraestrutura do BFF só tem gateways (sem persistência)", async () => {
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

  test("só os gateways usam fetch", async () => {
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

  test("ArchUnitTS conseguiu ler os imports do projeto", async () => {
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
