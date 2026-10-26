// Testes de arquitetura do movies-catalog com ArchUnitTS.
// Cada pasta em src/modules/catalog/features é uma slice e não pode importar outra.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { extractGraph, projectFiles } from "archunit";
import { TSCONFIG, escapeRegExp, expectNoViolations, listSlices } from "./archunit.helpers.js";

const files = () => projectFiles(TSCONFIG);

const DOMAIN = /^src\/(modules\/[^/]+\/domain|shared\/domain|shared\/kernel)\//;
const OUTSIDE_DOMAIN = /^src\/(?!(modules\/[^/]+\/domain|shared\/domain|shared\/kernel)\/)/;
const PORTS = /^src\/modules\/[^/]+\/application\//;
const OUTSIDE_DOMAIN_AND_PORTS =
  /^src\/(?!(modules\/[^/]+\/domain|modules\/[^/]+\/application|shared\/domain|shared\/kernel)\/)/;
const USE_CASE = /UseCase\.js$/;
const ADAPTER = /(Controller|Presenter)\.js$/;
const SHARED_HTTP_ADAPTERS = /^src\/shared\/http\//;
const INFRASTRUCTURE = /^src\/(modules\/[^/]+\/infrastructure|shared\/infrastructure)\//;
const COMPOSITION = /(\.factory|\.route|\.container|^app|^main)\.js$/;
const FEATURES = "src/modules/catalog/features";

describe("Clean Architecture - regra da dependência", () => {
  test("domínio não depende de nenhuma camada externa", async () => {
    await expectNoViolations(
      files().inPath(DOMAIN).shouldNot().dependOnFiles().inPath(OUTSIDE_DOMAIN)
    );
  });

  test("portas da Application dependem somente do domínio", async () => {
    await expectNoViolations(
      files().inPath(PORTS).shouldNot().dependOnFiles().inPath(OUTSIDE_DOMAIN_AND_PORTS)
    );
  });

  test("casos de uso dependem somente de domínio e portas", async () => {
    // o grafo inclui o próprio arquivo do use case, então ele é ignorado aqui
    const outsideDomainPortsAndUseCases = new RegExp(
      OUTSIDE_DOMAIN_AND_PORTS.source + String.raw`(?!.*UseCase\.js$)`
    );
    await expectNoViolations(
      files().withName(USE_CASE).shouldNot().dependOnFiles().inPath(outsideDomainPortsAndUseCases)
    );
  });

  test("casos de uso não conhecem controllers nem presenters", async () => {
    await expectNoViolations(
      files().withName(USE_CASE).shouldNot().dependOnFiles().withName(ADAPTER)
    );
  });

  test("casos de uso dependem da porta e não do repositório", async () => {
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

  test("controllers e presenters não dependem da composição (factory/route/container)", async () => {
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

  test("infraestrutura de persistência não depende de casos de uso nem de controllers", async () => {
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
        .haveName(/^([A-Z]\w*(UseCase|Controller|Presenter)|[a-z]\w*\.(factory|route))\.js$/)
    );
  });
});

describe("Frameworks & Drivers ficam nas bordas", () => {
  test("somente a infraestrutura HTTP importa node:http", async () => {
    await expectNoViolations(
      files()
        .inFolder("src/**")
        .should()
        .adhereTo(
          (file) =>
            !/from\s+["'](node:)?https?["']/.test(file.content) ||
            file.path.includes("src/shared/infrastructure/http/"),
          "node:http só pode ser importado em src/shared/infrastructure/http"
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

  test("repositórios ficam em infrastructure/persistence e seguem a convenção de nome", async () => {
    await expectNoViolations(
      files()
        .inFolder("src/modules/*/infrastructure/persistence/**")
        .should()
        .haveName(/^([A-Z]\w*Repository|[a-z]\w*Seed)\.js$/)
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
          edge.source.endsWith("GetMovieByIdUseCase.js") &&
          edge.target.endsWith("application/ports/MovieByIdReader.js")
      ),
      "dependência GetMovieByIdUseCase -> MovieByIdReader não encontrada"
    );
  });
});
