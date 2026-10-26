// e2e: sobe o movies-catalog em outro processo e chama as functions do BFF
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { app } from "@azure/functions";
import { makeAzureContext } from "../helpers/fakes.js";

const catalogMain = fileURLToPath(
  new URL("../../../services/movies-catalog/src/main.js", import.meta.url)
);
const registered = {};
let catalogProcess;

before(async () => {
  catalogProcess = spawn(process.execPath, [catalogMain], {
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "inherit"]
  });
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("microsserviço não subiu em 10s")), 10_000);
    catalogProcess.stdout.on("data", (chunk) => {
      const found = /ouvindo em (http:\/\/\S+)/.exec(String(chunk));
      if (found) {
        clearTimeout(timer);
        resolve(found[1]);
      }
    });
    catalogProcess.on("exit", (code) => reject(new Error(`microsserviço saiu com código ${code}`)));
  });

  process.env.MOVIES_CATALOG_URL = url;
  app.http = (name, options) => {
    registered[name] = options;
  };
  await import("../../src/index.js");
});

after(() => catalogProcess?.kill());

const call = (name, params = {}) =>
  registered[name].handler(
    { method: "GET", url: `/api/${name}`, params, query: new URLSearchParams() },
    makeAzureContext()
  );

test("BFF -> microsserviço: GET /api/movies devolve os 6 filmes do catálogo", async () => {
  const response = await call("getMovies");
  assert.equal(response.status, 200);
  assert.equal(response.jsonBody.length, 6);
  assert.equal(response.jsonBody[0].title, "Interestelar");
  assert.deepEqual(Object.keys(response.jsonBody[0]), [
    "id", "title", "year", "genre", "rating", "poster"
  ]);
});

test("BFF -> microsserviço: GET /api/movies/3 devolve Matrix com todos os detalhes", async () => {
  const response = await call("getMovieById", { id: "3" });
  assert.equal(response.status, 200);
  assert.equal(response.jsonBody.title, "Matrix");
  assert.equal(response.jsonBody.year, 1999);
  assert.equal(response.jsonBody.director, "Lana e Lilly Wachowski");
});

test("BFF -> microsserviço: id inexistente devolve 404", async () => {
  const response = await call("getMovieById", { id: "99" });
  assert.equal(response.status, 404);
});
