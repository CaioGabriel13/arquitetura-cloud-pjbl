import { test } from "node:test";
import assert from "node:assert/strict";
import { ListMoviesUseCase } from "../../src/modules/catalog/features/list-movies/ListMoviesUseCase.js";
import { GetMovieByIdUseCase } from "../../src/modules/catalog/features/get-movie-by-id/GetMovieByIdUseCase.js";
import { NotFoundError, ValidationError } from "../../src/shared/domain/errors/index.js";
import { makeMovie, FakeMovieReader } from "../helpers/fakes.js";

test("ListMoviesUseCase devolve todos os filmes da porta MovieListReader", async () => {
  const reader = new FakeMovieReader([makeMovie({ id: 1 }), makeMovie({ id: 2 })]);
  const result = await new ListMoviesUseCase({ movieListReader: reader }).execute();

  assert.equal(result.length, 2);
  assert.deepEqual(reader.calls, ["findAll"]);
});

test("ListMoviesUseCase filtra por gênero sem diferenciar maiúsculas", async () => {
  const reader = new FakeMovieReader([
    makeMovie({ id: 1, genre: "Drama" }),
    makeMovie({ id: 2, genre: "Ação" })
  ]);
  const result = await new ListMoviesUseCase({ movieListReader: reader }).execute({ genre: "ação" });

  assert.deepEqual(result.map((m) => m.id.value), [2]);
});

test("ListMoviesUseCase falha cedo se a dependência não cumpre a porta", () => {
  assert.throws(
    () => new ListMoviesUseCase({ movieListReader: { findById() {} } }),
    /MovieListReader \(faltando: findAll\)/
  );
});

test("GetMovieByIdUseCase devolve o filme pela porta MovieByIdReader", async () => {
  const movie = makeMovie({ id: 5 });
  const useCase = new GetMovieByIdUseCase({ movieByIdReader: new FakeMovieReader([movie]) });

  assert.equal(await useCase.execute({ id: "5" }), movie);
});

test("GetMovieByIdUseCase lança NotFoundError quando o filme não existe", async () => {
  const useCase = new GetMovieByIdUseCase({ movieByIdReader: new FakeMovieReader([]) });
  await assert.rejects(() => useCase.execute({ id: 99 }), NotFoundError);
});

test("GetMovieByIdUseCase rejeita id inválido sem consultar a porta", async () => {
  const reader = new FakeMovieReader([]);
  const useCase = new GetMovieByIdUseCase({ movieByIdReader: reader });

  await assert.rejects(() => useCase.execute({ id: "abc" }), ValidationError);
  assert.deepEqual(reader.calls, []);
});
