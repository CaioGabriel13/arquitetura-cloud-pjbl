import { app } from "@azure/functions";
import { adaptAzureHttp } from "../../../../shared/infrastructure/azure/azureHttpAdapter.js";
import { makeGetMovieByIdController } from "./getMovieById.factory.js";

/**
 * Frameworks & Drivers — registro da Azure Function da slice "get-movie-by-id".
 * Junto com o azureHttpAdapter, é o único lugar que importa `@azure/functions`.
 */
app.http("getMovieById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movies/{id}",
  handler: adaptAzureHttp(makeGetMovieByIdController)
});
