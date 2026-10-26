/**
 * Presenter (Interface Adapter) — converte a entidade Movie no contrato
 * público de detalhe do microsserviço.
 */
export class MoviePresenter {
  /** @param {import("../../domain/Movie.js").Movie} movie */
  static toResponse(movie) {
    return {
      id: movie.id.value,
      title: movie.title,
      releaseYear: movie.releaseYear,
      genre: movie.genre,
      director: movie.director,
      rating: movie.rating,
      synopsis: movie.synopsis,
      posterUrl: movie.posterUrl
    };
  }
}
