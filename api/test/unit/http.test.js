const { test } = require("node:test");
const assert = require("node:assert/strict");
const { adaptAzureHttp } = require("../../src/shared/http/azureHttpAdapter");
const { mapErrorToHttpResponse, registerErrorMapping } = require("../../src/shared/http/errorMapper");
const { DomainError, NotFoundError, ValidationError } = require("../../src/shared/domain/errors");
const { makeAzureContext } = require("../helpers/fakes");

test("errorMapper converte erros de domínio em 404 / 400 / 500", () => {
  assert.equal(mapErrorToHttpResponse(new NotFoundError("x")).status, 404);
  assert.equal(mapErrorToHttpResponse(new ValidationError("x")).status, 400);
  assert.equal(mapErrorToHttpResponse(new Error("boom")).status, 500);
});

test("errorMapper é aberto para extensão (OCP)", () => {
  class ConflictError extends DomainError {}
  registerErrorMapping(ConflictError, (e) => ({ status: 409, body: { message: e.message } }));
  assert.deepEqual(mapErrorToHttpResponse(new ConflictError("dup")), {
    status: 409,
    body: { message: "dup" }
  });
});

test("adaptAzureHttp converte request/response do Azure e trata exceções", async () => {
  const echoController = {
    handle: async (req) => {
      if (req.params.fail) throw new NotFoundError("não achei");
      return { status: 200, body: { params: req.params, query: req.query } };
    }
  };
  const handler = adaptAzureHttp(() => echoController);

  const okResponse = await handler(
    { method: "GET", url: "/x", params: { id: "1" }, query: new URLSearchParams("a=b") },
    makeAzureContext()
  );
  assert.deepEqual(okResponse, {
    status: 200,
    jsonBody: { params: { id: "1" }, query: { a: "b" } }
  });

  const errorResponse = await handler({ params: { fail: "1" } }, makeAzureContext());
  assert.deepEqual(errorResponse, { status: 404, jsonBody: { message: "não achei" } });
});
