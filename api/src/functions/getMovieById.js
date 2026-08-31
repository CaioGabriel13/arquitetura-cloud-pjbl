const { app } = require("@azure/functions");
const { movies } = require("../data/movies");

app.http("getMovieById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movies/{id}",
  handler: async (request, context) => {
    const id = Number(request.params.id);
    context.log(`GET /api/movies/${id}`);

    const movie = movies.find((m) => m.id === id);

    if (!movie) {
      return {
        status: 404,
        jsonBody: { message: `Filme com id ${id} não encontrado.` }
      };
    }

    return {
      status: 200,
      jsonBody: movie
    };
  }
});
