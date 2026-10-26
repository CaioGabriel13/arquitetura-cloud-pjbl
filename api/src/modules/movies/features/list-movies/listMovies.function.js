import { app } from "@azure/functions";
import { adaptAzureHttp } from "../../../../shared/infrastructure/azure/azureHttpAdapter.js";
import { makeListMoviesController } from "./listMovies.factory.js";

/**
 * Frameworks & Drivers — registro da Azure Function da slice "list-movies".
 * Junto com o azureHttpAdapter, é o único lugar que importa `@azure/functions`.
 */
app.http("getMovies", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movies",
  handler: adaptAzureHttp(makeListMoviesController)
});
