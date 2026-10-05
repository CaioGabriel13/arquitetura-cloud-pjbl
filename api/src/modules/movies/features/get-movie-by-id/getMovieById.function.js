const { app } = require("@azure/functions");
const { adaptAzureHttp } = require("../../../../shared/http/azureHttpAdapter");
const { makeGetMovieByIdController } = require("./getMovieById.factory");

/**
 * Frameworks & Drivers — registro da Azure Function da slice "get-movie-by-id".
 * Único arquivo da slice que importa `@azure/functions`.
 */
app.http("getMovieById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movies/{id}",
  handler: adaptAzureHttp(makeGetMovieByIdController)
});
