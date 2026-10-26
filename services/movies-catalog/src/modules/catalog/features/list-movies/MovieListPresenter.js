/**
 * Presenter (Interface Adapter) — converte entidades Movie no contrato
 * público de listagem do microsserviço: { items: [...], total }.
 */
export class MovieListPresenter {
  /** @param {import("../../domain/Movie.js").Movie[]} movies */
  static toResponse(movies) {
    return {
      items: movies.map((movie) => ({
        id: movie.id.value,
        title: movie.title,
        releaseYear: movie.releaseYear,
        genre: movie.genre,
        director: movie.director,
        rating: movie.rating,
        synopsis: movie.synopsis,
        posterUrl: movie.posterUrl
      })),
      total: movies.length
    };
  }
}
