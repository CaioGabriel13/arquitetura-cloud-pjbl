const { app } = require("@azure/functions");
const { adaptAzureHttp } = require("../../../../shared/http/azureHttpAdapter");
const { makeListMoviesController } = require("./listMovies.factory");

/**
 * Frameworks & Drivers — registro da Azure Function da slice "list-movies".
 * Único arquivo da slice que importa `@azure/functions`.
 */
app.http("getMovies", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movies",
  handler: adaptAzureHttp(makeListMoviesController)
});
