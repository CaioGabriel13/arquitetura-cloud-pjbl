const { app } = require("@azure/functions");
const { movies } = require("../data/movies");

app.http("getMovies", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movies",
  handler: async (request, context) => {
    context.log("GET /api/movies");

    const list = movies.map(({ id, title, year, genre, rating, poster }) => ({
      id,
      title,
      year,
      genre,
      rating,
      poster
    }));

    return {
      status: 200,
      jsonBody: list
    };
  }
});
