const { test } = require("node:test");
const assert = require("node:assert/strict");
const { ListMoviesUseCase } = require("../../src/modules/movies/features/list-movies/ListMoviesUseCase");
const { GetMovieByIdUseCase } = require("../../src/modules/movies/features/get-movie-by-id/GetMovieByIdUseCase");
const { NotFoundError, ValidationError } = require("../../src/shared/domain/errors");
const { makeMovie, FakeMovieReader } = require("../helpers/fakes");

test("ListMoviesUseCase devolve todos os filmes da porta MovieListReader", async () => {
  const reader = new FakeMovieReader([makeMovie({ id: 1 }), makeMovie({ id: 2 })]);
  const useCase = new ListMoviesUseCase({ movieListReader: reader });

  const result = await useCase.execute();

  assert.equal(result.length, 2);
  assert.deepEqual(reader.calls, ["findAll"]);
});

test("ListMoviesUseCase falha cedo se a dependência não cumpre a porta (DIP/ISP)", () => {
  assert.throws(
    () => new ListMoviesUseCase({ movieListReader: { findById() {} } }),
    /MovieListReader \(faltando: findAll\)/
  );
});

test("GetMovieByIdUseCase precisa apenas de findById (ISP)", async () => {
  const movie = makeMovie({ id: 5 });
  const onlyFindById = { findById: async (id) => (id.value === 5 ? movie : null) };
  const useCase = new GetMovieByIdUseCase({ movieByIdReader: onlyFindById });

  assert.equal(await useCase.execute({ id: "5" }), movie);
});

test("GetMovieByIdUseCase lança NotFoundError quando o filme não existe", async () => {
  const useCase = new GetMovieByIdUseCase({ movieByIdReader: new FakeMovieReader([]) });
  await assert.rejects(() => useCase.execute({ id: 99 }), NotFoundError);
});

test("GetMovieByIdUseCase lança ValidationError para id inválido sem consultar a porta", async () => {
  const reader = new FakeMovieReader([]);
  const useCase = new GetMovieByIdUseCase({ movieByIdReader: reader });

  await assert.rejects(() => useCase.execute({ id: "abc" }), ValidationError);
  assert.deepEqual(reader.calls, []);
});
