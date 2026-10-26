import { test } from "node:test";
import assert from "node:assert/strict";
import { compilePath } from "../../src/shared/infrastructure/http/createHttpServer.js";
import { mapErrorToHttpResponse } from "../../src/shared/http/errorMapper.js";
import { NotFoundError, ValidationError } from "../../src/shared/domain/errors/index.js";

test("compilePath extrai parâmetros de rota", () => {
  const match = compilePath("/v1/movies/:id");
  assert.deepEqual(match("/v1/movies/3"), { id: "3" });
  assert.deepEqual(match("/v1/movies/3/"), { id: "3" });
  assert.equal(match("/v1/movies"), null);
  assert.equal(match("/v1/movies/3/extra"), null);
});

test("errorMapper converte erros de domínio em 404 / 400 / 500", () => {
  assert.equal(mapErrorToHttpResponse(new NotFoundError("x")).status, 404);
  assert.equal(mapErrorToHttpResponse(new ValidationError("x")).status, 400);
  assert.equal(mapErrorToHttpResponse(new Error("boom")).status, 500);
});
